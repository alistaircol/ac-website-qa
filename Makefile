redis:
	docker run -p 6379:6379 --name ac-website-qa-redis redis

consumer:
	node consumer.js

producer:
	pm2 ecosystem.config.js
