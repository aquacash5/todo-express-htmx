app-name := "todo-app"
app-volume := "todo-data"
app-port := "3000"

build:
  podman build -t {{app-name}}:latest .

run:
  podman run -d --name {{app-name}} --replace --restart unless-stopped -v {{app-volume}}:/data:rw -p 3000:{{app-port}} {{app-name}}:latest

stop:
  podman stop {{app-name}}

logs:
  podman logs -f {{app-name}}

clean:
  podman system prune --all
