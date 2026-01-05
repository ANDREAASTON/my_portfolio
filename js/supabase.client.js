// supabase.client.js
const SUPABASE_URL = "https://abcblmwbfegcsakuoyqv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2JsbXdiZmVnY3Nha3VveXF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1MzUzMjQsImV4cCI6MjA4MzExMTMyNH0.kcJkl4nZqFIuOH2vdZeTnYit1hvRCqfGwgBxARoPi2k";
window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
