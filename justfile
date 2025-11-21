app-name := "todo-app"
app-volume := "todo-data"
app-port := "3000"

build:
  podman build --tag {{app-name}}:latest .

run:
  podman run \
    --detach \
    --replace \
    --name {{app-name}} \
    --restart unless-stopped \
    --volume {{app-volume}}:/data:rw \
    --publish 3000:{{app-port}} \
    {{app-name}}:latest

stop:
  podman stop {{app-name}}

logs:
  podman logs --follow {{app-name}}

clean:
  podman system prune --all --filter label={{app-name}}
