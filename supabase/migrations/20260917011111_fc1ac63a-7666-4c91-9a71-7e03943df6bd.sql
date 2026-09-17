INSERT INTO public.plans (id, name, price_cents, monthly_credits, highlight, features, sort_order) VALUES
 ('starter','Starter',9700,60,false,'["60 cenas por mês","Galeria completa de pessoas","Download em 9x16","Histórico de gerações"]',1),
 ('pro','Pro',19700,180,true,'["180 cenas por mês","Vídeos curtos a partir das cenas","Galeria completa de pessoas","Suporte prioritário"]',2),
 ('studio','Studio',39700,500,false,'["500 cenas por mês","Vídeos curtos ilimitados pelos créditos","Vários produtos em paralelo","Suporte dedicado"]',3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.gallery_models (name, gender, description, image_url, sort_order) VALUES
 ('Bruna','feminino','Jovem, estilo casual urbano','f1.jpg',1),
 ('Aline','feminino','Fitness, energia alta','f2.jpg',2),
 ('Renata','feminino','Executiva, tom sofisticado','f3.jpg',3),
 ('Carol','feminino','Plus size, verão e leveza','f4.jpg',4),
 ('Sônia','feminino','Madura, acolhedora','f5.jpg',5),
 ('Yumi','feminino','Streetwear, vibe TikTok','f6.jpg',6),
 ('Léo','masculino','Jovem, casual do dia a dia','m1.jpg',7),
 ('Marcos','masculino','Fitness, performance','m2.jpg',8),
 ('Rafael','masculino','Executivo, sofisticado','m3.jpg',9),
 ('Paulo','masculino','Maduro, confiança e experiência','m4.jpg',10),
 ('Kenji','masculino','Streetwear, vibe TikTok','m5.jpg',11),
 ('Diego','masculino','Plus size, simpatia','m6.jpg',12)
ON CONFLICT DO NOTHING;