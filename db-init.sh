PODNAME=$(kubectl get pods | grep -E '^mysql' | awk '{print $1}')

MYSQL_ROOT_PASSWORD="password";

# Create database if not exists
kubectl exec -it $PODNAME -- mysql -u root -p$MYSQL_ROOT_PASSWORD -e "CREATE DATABASE IF NOT EXISTS whisper_microservice;"

# Copy migration files to pod
kubectl exec -it $PODNAME -- sh -c 'if [ -d /tmp/sql ]; then rm -rf /tmp/sql; fi'
kubectl exec -it $PODNAME -- sh -c 'mkdir -p /tmp/sql'
find ./mysql -type f -name "*.sql" -exec kubectl cp {} $PODNAME:/tmp/sql/ \;

# # Run migration files
kubectl exec -it $PODNAME -- sh -c 'for f in /tmp/sql/*.sql; do mysql -u root -p$MYSQL_ROOT_PASSWORD whisper_microservice < "$f"; done';