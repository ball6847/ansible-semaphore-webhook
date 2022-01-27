# Ansible Semaphore Webhook

## Compose file example

```yml
version: '3'

services:
  webhook:
    image: ball6847/ansible-semaphore-webhook:latest
    ports:
      - 3000:3000
    environment:
      WEBHOOK_TOKEN: 123456789
      SEMAPHORE_URL: https://ansible.yourdomain.com
      SEMAPHORE_USER: webhook
      SEMAPHORE_PASSWORD: secure

```
