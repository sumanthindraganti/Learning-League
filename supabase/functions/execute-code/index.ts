import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Updated JDoodle credentials
const JDOODLE_CLIENT_ID = "972916f47cd4af7eeefebc869b9dfb3e";
const JDOODLE_CLIENT_SECRET = "90cd333b4997a74e13c427116dfb2928817c19f373ff7bcda2e22cd8f0c8c89e";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { code } = await req.json();

    if (!code) {
      return new Response(
        JSON.stringify({ error: "Code is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log("Executing code with JDoodle API...");
    console.log("Code:", code);

    const response = await fetch("https://api.jdoodle.com/v1/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        clientId: JDOODLE_CLIENT_ID,
        clientSecret: JDOODLE_CLIENT_SECRET,
        script: code,
        language: "c",
        versionIndex: "0",
      }),
    });

    if (!response.ok) {
      throw new Error(`JDoodle API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("JDoodle API response:", data);

    // Process the output to handle empty or null cases
    let output = data.output;
    
    // If output is empty or undefined, return appropriate message
    if (!output || output.trim() === '') {
      output = 'No output';
    }

    // Ensure output ends with newline for consistent comparison
    if (!output.endsWith('\n')) {
      output += '\n';
    }

    return new Response(
      JSON.stringify({ ...data, output }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error executing code:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to execute code",
        details: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});