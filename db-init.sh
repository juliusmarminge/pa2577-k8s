PODNAME=$(kubectl get pods | grep -E '^wms-mysql' | awk '{print $1}')
MYSQL_ROOT_PASSWORD="password";
MYSQL_DATABASE="wms"
MYSQL_USER="wms"
MYSQL_PASSWORD="wmspassword"

# Wait for pod to be ready
while [ "$(kubectl get pod $PODNAME -o jsonpath={.status.phase})" != "Running" ]; do { 
    echo 'Waiting for status "Running"...';
    sleep 1; 
} done

# Create user
kubectl exec -it $PODNAME -- mysql -u root -p$MYSQL_ROOT_PASSWORD -e \
    "CREATE USER IF NOT EXISTS '$MYSQL_USER'@'%' IDENTIFIED BY '$MYSQL_PASSWORD';"

# Grant privileges to the user
kubectl exec -it $PODNAME -- mysql -u root -p$MYSQL_ROOT_PASSWORD -e \
    "GRANT ALL PRIVILEGES ON $MYSQL_DATABASE.* TO '$MYSQL_USER'@'%'; FLUSH PRIVILEGES;"

# Create database if not exists
kubectl exec -it $PODNAME -- mysql -u root -p$MYSQL_ROOT_PASSWORD -e \
    "CREATE DATABASE IF NOT EXISTS $MYSQL_DATABASE;"

# Copy migration files to pod
kubectl exec -it $PODNAME -- sh -c 'if [ -d /tmp/sql ]; then rm -rf /tmp/sql; fi'
kubectl exec -it $PODNAME -- sh -c 'mkdir -p /tmp/sql'
find ./mysql -type f -name "*.sql" -exec kubectl cp {} $PODNAME:/tmp/sql/ \;

# Run migration files
kubectl exec -it $PODNAME -- sh -c \
    'for f in /tmp/sql/*.sql; do mysql -u root -p$MYSQL_ROOT_PASSWORD $MYSQL_DATABASE < "$f"; done';