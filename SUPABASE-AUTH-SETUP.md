# Supabase Authentication Setup Guide

This guide explains how to set up and use Google Sign-In with Supabase in the Quranly Web App.

## Prerequisites

1. A Supabase account and project (already set up)
2. A Google Cloud project with OAuth credentials (already set up)

## Supabase Configuration

1. **Set up Supabase Auth Provider**
   - Go to your Supabase dashboard: https://ntunvgoaspiioenqizxx.supabase.co
   - Navigate to Authentication > Providers
   - Enable Google provider and enter your OAuth credentials (Client ID and Client Secret)
   - Set the Authorized redirect URI to: `https://ntunvgoaspiioenqizxx.supabase.co/auth/v1/callback`

2. **Set up Database Tables**
   - Run the database initialization script to create necessary tables:
   ```bash
   cd scripts
   node initialize-supabase.js
   ```

   Or you can manually execute the SQL in the Supabase SQL editor:
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `scripts/setup-database.sql`
   - Execute the SQL

3. **Configure Row Level Security (RLS)**
   - The SQL script includes RLS policies to ensure users can only access their own data
   - Make sure these policies are correctly applied by checking the table settings in Supabase

## How Authentication Works

The authentication flow works as follows:

1. User clicks the "Sign In" button in the app
2. They are redirected to Google's authentication page
3. After successful authentication, Google redirects back to the app
4. The Supabase client library handles the token exchange
5. The user is now authenticated in the app

## Features Implemented

1. **User Authentication**
   - Sign in with Google
   - Sign out
   - Display user profile information

2. **User Data Management**
   - User profiles (automatically created upon sign-up)
   - User progress tracking
   - Bookmark management
   - Notes management

3. **Security**
   - Row Level Security to ensure data privacy
   - Secure token handling via Supabase client

## Implementation Details

The following components have been implemented:

1. **Auth Provider** (`/src/hooks/use-auth.tsx`)
   - Manages authentication state
   - Provides authentication functions

2. **Auth Component** (`/src/components/Auth.tsx`)
   - UI for login/logout and user profile

3. **Callback Handler** (`/src/pages/auth/Callback.tsx`)
   - Handles OAuth redirect and token exchange

4. **Profile Page** (`/src/pages/Profile.tsx`)
   - Displays user profile and user data

5. **API Utilities** (`/src/utils/user-data.ts`)
   - Functions for interacting with user data

## Testing Authentication

To test the authentication:

1. Run the application
2. Click the "Sign In" button in the header
3. Complete the Google authentication flow
4. You should be redirected back to the app and see your Google profile picture in the header
5. Click on the profile picture to access profile options or sign out

## Troubleshooting

If you encounter issues:

1. **Redirect URI Issues**
   - Verify that the redirect URI in Google Cloud Console matches the one in Supabase

2. **Database Tables Missing**
   - Run the database initialization script again
   - Check for any errors in the console output

3. **Authentication Errors**
   - Check browser console for specific error messages
   - Verify that the Google provider is enabled in Supabase

4. **Client Keys**
   - Ensure you're using the correct API keys from Supabase

## Resources

- [Supabase Authentication Docs](https://supabase.com/docs/guides/auth)
- [Supabase Google Auth Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security) 