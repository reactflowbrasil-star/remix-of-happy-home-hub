
CREATE POLICY "gallery readable" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'gallery');

CREATE POLICY "own products" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'products' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'products' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "own scenes files" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'scenes' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'scenes' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "own videos files" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'videos' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'videos' AND (storage.foldername(name))[1] = auth.uid()::text);
