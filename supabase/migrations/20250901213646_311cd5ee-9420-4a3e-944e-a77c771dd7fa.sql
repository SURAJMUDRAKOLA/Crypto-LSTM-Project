-- Remove unused tables that are not being used in the application
DROP TABLE IF EXISTS evaluations CASCADE;
DROP TABLE IF EXISTS holdings CASCADE; 
DROP TABLE IF EXISTS portfolios CASCADE;
DROP TABLE IF EXISTS price_alerts CASCADE;
DROP TABLE IF EXISTS training_data CASCADE;