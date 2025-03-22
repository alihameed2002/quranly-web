import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const supabaseUrl = 'https://ntunvgoaspiioenqizxx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50dW52Z29hc3BpaW9lbnFpenh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2MDEzOTQsImV4cCI6MjA1ODE3NzM5NH0.cfpDxYC4LAALzrjqb0OPsuHRthS2mb2j9-uCu6JC0Es';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Read SQL file
const sqlFilePath = path.join(__dirname, 'setup-database.sql');
const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

// Split SQL statements by semicolon
const sqlStatements = sqlContent
  .split(';')
  .map(statement => statement.trim())
  .filter(statement => statement.length > 0);

// Execute SQL statements
async function initializeDatabase() {
  console.log('Initializing database...');
  
  try {
    for (let i = 0; i < sqlStatements.length; i++) {
      const statement = sqlStatements[i];
      console.log(`Executing statement ${i + 1} of ${sqlStatements.length}...`);
      
      const { error } = await supabase.rpc('exec_sql', { query: statement + ';' });
      
      if (error) {
        console.error(`Error executing statement ${i + 1}:`, error);
      }
    }
    
    console.log('Database initialization completed successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Execute the initialization
initializeDatabase(); 