-- Allow public inserts into models table
CREATE POLICY "Anyone can insert models" 
ON public.models 
FOR INSERT 
WITH CHECK (true);

-- Allow public inserts into predictions table  
CREATE POLICY "Anyone can insert predictions" 
ON public.predictions 
FOR INSERT 
WITH CHECK (true);