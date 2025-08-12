// Create a simple SQL tag function for syntax highlighting
const sql = (strings, ...values) => {
    return strings.reduce((result, string, i) => {
        return result + string + (values[i] || '');
    }, '');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.raw(sql`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            clerk_user_id VARCHAR(255) UNIQUE NOT NULL,
            
            -- Basic user information
            email_addresses JSONB,
            phone_numbers JSONB,
            first_name VARCHAR(255),
            last_name VARCHAR(255),
            username VARCHAR(255),
            
            -- Profile information
            profile_image_url TEXT,
            image_url TEXT,
            has_image BOOLEAN DEFAULT false,
            
            -- Authentication status
            banned BOOLEAN DEFAULT false,
            locked BOOLEAN DEFAULT false,
            email_verification_attempts INTEGER DEFAULT 0,
            phone_verification_attempts INTEGER DEFAULT 0,
            
            -- External accounts (OAuth)
            external_accounts JSONB DEFAULT '[]'::jsonb,
            external_id VARCHAR(255),
            
            -- Verification status
            email_verified BOOLEAN DEFAULT false,
            phone_verified BOOLEAN DEFAULT false,
            two_factor_enabled BOOLEAN DEFAULT false,
            
            -- Timestamps from Clerk
            created_at_clerk TIMESTAMP,
            updated_at_clerk TIMESTAMP,
            last_sign_in_at TIMESTAMP,
            last_active_at TIMESTAMP,
            
            -- Private metadata (admin use)
            private_metadata JSONB DEFAULT '{}'::jsonb,
            public_metadata JSONB DEFAULT '{}'::jsonb,
            unsafe_metadata JSONB DEFAULT '{}'::jsonb,
            
            -- Additional fields for flexibility
            gender VARCHAR(50),
            birthday DATE,
            web3_wallets JSONB DEFAULT '[]'::jsonb,
            saml_accounts JSONB DEFAULT '[]'::jsonb,
            
            -- Our app specific fields
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT true,
            
            -- Webhook metadata
            webhook_received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            webhook_event_type VARCHAR(100),
            raw_webhook_data JSONB
        );
        
        -- Indexes for performance
        CREATE INDEX IF NOT EXISTS idx_users_clerk_user_id ON users(clerk_user_id);
        CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email_verified);
        CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
        CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
        CREATE INDEX IF NOT EXISTS idx_users_last_sign_in ON users(last_sign_in_at);
        
        -- GIN indexes for JSONB fields for better querying
        CREATE INDEX IF NOT EXISTS idx_users_email_addresses_gin ON users USING GIN (email_addresses);
        CREATE INDEX IF NOT EXISTS idx_users_external_accounts_gin ON users USING GIN (external_accounts);
        CREATE INDEX IF NOT EXISTS idx_users_public_metadata_gin ON users USING GIN (public_metadata);


        -- this is the user which will be added via webhooks from clerk

        -- below is form table
        CREATE TABLE forms (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            is_public BOOLEAN DEFAULT false,
            is_published BOOLEAN DEFAULT false,
            is_accepting_responses BOOLEAN DEFAULT true,
            require_login BOOLEAN DEFAULT false,
            allow_multiple_responses BOOLEAN DEFAULT true,
            show_progress_bar BOOLEAN DEFAULT false,
            
            -- Form styling and branding
            theme_color VARCHAR(7) DEFAULT '#1a73e8',
            background_color VARCHAR(7) DEFAULT '#ffffff',
            header_image_url TEXT,
            
            -- Form behavior
            confirmation_message TEXT DEFAULT 'Your response has been recorded.',
            redirect_url TEXT,
            email_notifications BOOLEAN DEFAULT false,
           
            
            -- Form structure
            elements JSONB DEFAULT '[]'::jsonb,
            
            -- Analytics
            total_responses INTEGER DEFAULT 0,
            view_count INTEGER DEFAULT 0,
            
            -- Timestamps
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            published_at TIMESTAMP,
            expires_at TIMESTAMP
        );

        -- responses tables
        CREATE TABLE responses (
            id SERIAL PRIMARY KEY,
            form_id INTEGER REFERENCES forms(id) ON DELETE CASCADE,
            respondent_email VARCHAR(255),
            respondent_name VARCHAR(255),
            
            -- Response data
            response_data JSONB DEFAULT '{}'::jsonb,
            
            -- Response metadata
            ip_address INET,
            user_agent TEXT,
            completion_time_seconds INTEGER,
            
            -- Timestamps
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

       

        -- Indexes for forms
        CREATE INDEX IF NOT EXISTS idx_forms_user_id ON forms(user_id);
        CREATE INDEX IF NOT EXISTS idx_forms_is_public ON forms(is_public);
        CREATE INDEX IF NOT EXISTS idx_forms_is_published ON forms(is_published);
        CREATE INDEX IF NOT EXISTS idx_forms_created_at ON forms(created_at);
        CREATE INDEX IF NOT EXISTS idx_forms_elements_gin ON forms USING GIN (elements);

        -- Indexes for responses
        CREATE INDEX IF NOT EXISTS idx_responses_form_id ON responses(form_id);
        CREATE INDEX IF NOT EXISTS idx_responses_created_at ON responses(created_at);
        CREATE INDEX IF NOT EXISTS idx_responses_respondent_email ON responses(respondent_email);
        CREATE INDEX IF NOT EXISTS idx_responses_data_gin ON responses USING GIN (response_data);

       
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.raw(sql`
       
        DROP TABLE IF EXISTS responses;
        DROP TABLE IF EXISTS forms;
        DROP TABLE IF EXISTS users;
    `);
};
