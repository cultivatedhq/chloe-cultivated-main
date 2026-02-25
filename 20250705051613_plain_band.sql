import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface HubSpotFormData {
  email?: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  company?: string;
  [key: string]: string | undefined;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const hubspotToken = Deno.env.get("HUBSPOT_TOKEN");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    }

    console.log("📥 Received HubSpot webhook request");
    console.log("Request method:", req.method);
    console.log("Content-Type:", req.headers.get("content-type"));

    let formData: HubSpotFormData = {};
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      formData = await req.json();
      console.log("📦 Parsed JSON payload");
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formDataText = await req.text();
      formData = Object.fromEntries(new URLSearchParams(formDataText)) as HubSpotFormData;
      console.log("📦 Parsed form-urlencoded payload");
    } else {
      console.error("❌ Unsupported content type:", contentType);
      throw new Error(`Unsupported content type: ${contentType}`);
    }

    console.log("📋 Form data keys:", Object.keys(formData).join(", "));

    const email = formData.email || formData["properties.email"] || "";
    const firstname = formData.firstname || formData["properties.firstname"] || "";
    const lastname = formData.lastname || formData["properties.lastname"] || "";
    const phone = formData.phone || formData["properties.phone"] || "";
    const company = formData.company || formData["properties.company"] || "";

    if (!email) {
      console.error("❌ Email is missing from form submission");
      throw new Error("Email is required but was not provided in the form submission");
    }

    console.log(`✅ Extracted form data:`, {
      email,
      firstname,
      lastname,
      phone: phone ? "***" : "(not provided)",
      company: company || "(not provided)"
    });

    const { createClient } = await import("npm:@supabase/supabase-js@2");
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: sessionData, error: sessionError } = await supabase
      .from("clarity_audit_initial_sessions")
      .insert([
        {
          email: email,
          name: firstname || null
        }
      ])
      .select()
      .single();

    if (sessionError) {
      console.error("❌ Database error creating session:", sessionError);
      throw new Error(`Failed to create session: ${sessionError.message}`);
    }

    console.log(`✅ Created session in database with ID: ${sessionData.id}`);

    if (hubspotToken) {
      console.log("🔄 Syncing contact to HubSpot CRM...");

      try {
        const hubspotPayload = {
          properties: {
            email: email,
            firstname: firstname || "",
            lastname: lastname || "",
            ...(phone && { phone: phone }),
            ...(company && { company: company }),
            lifecyclestage: "lead",
            hs_lead_status: "NEW",
            source: "Clarity Audit Form"
          }
        };

        let contactId: string | null = null;

        const createRes = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${hubspotToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(hubspotPayload)
        });

        if (createRes.status === 409) {
          console.log("📝 Contact already exists, searching for existing contact...");

          const searchRes = await fetch("https://api.hubapi.com/crm/v3/objects/contacts/search", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${hubspotToken}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              filterGroups: [{
                filters: [{
                  propertyName: "email",
                  operator: "EQ",
                  value: email
                }]
              }]
            })
          });

          if (searchRes.ok) {
            const searchData = await searchRes.json();
            contactId = searchData?.results?.[0]?.id;

            if (contactId) {
              console.log(`✅ Found existing contact: ${contactId}`);

              const updateRes = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
                method: "PATCH",
                headers: {
                  "Authorization": `Bearer ${hubspotToken}`,
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({ properties: hubspotPayload.properties })
              });

              if (updateRes.ok) {
                console.log(`✅ Updated existing contact in HubSpot`);
              } else {
                console.error("⚠️ Failed to update contact:", await updateRes.text());
              }
            }
          }
        } else if (createRes.ok) {
          const createData = await createRes.json();
          contactId = createData.id;
          console.log(`✅ Created new contact in HubSpot: ${contactId}`);
        } else {
          console.error("⚠️ HubSpot API error:", createRes.status, await createRes.text());
        }

        if (contactId) {
          const noteRes = await fetch("https://api.hubapi.com/crm/v3/objects/notes", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${hubspotToken}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              properties: {
                hs_note_body: `Contact submitted Leadership Clarity Audit form. Session ID: ${sessionData.id}`
              }
            })
          });

          if (noteRes.ok) {
            const note = await noteRes.json();

            await fetch(`https://api.hubapi.com/crm/v4/objects/notes/${note.id}/associations/contacts/${contactId}/note_to_contact`, {
              method: "PUT",
              headers: { "Authorization": `Bearer ${hubspotToken}` }
            });

            console.log("✅ Added note to contact in HubSpot");
          }
        }

      } catch (hubspotError) {
        console.error("⚠️ HubSpot sync failed (continuing anyway):", hubspotError);
      }
    } else {
      console.warn("⚠️ HUBSPOT_TOKEN not configured - skipping CRM sync");
    }

    const redirectUrl = `https://www.cultivatedhq.com.au/clarityauditredirect?sessionId=${sessionData.id}&email=${encodeURIComponent(email)}${firstname ? `&firstname=${encodeURIComponent(firstname)}` : ""}${lastname ? `&lastname=${encodeURIComponent(lastname)}` : ""}${phone ? `&phone=${encodeURIComponent(phone)}` : ""}${company ? `&company=${encodeURIComponent(company)}` : ""}`;

    console.log(`✅ Webhook processing complete. Redirecting to: ${redirectUrl}`);

    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        "Location": redirectUrl
      }
    });

  } catch (error) {
    console.error("💥 Error processing HubSpot webhook:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
});