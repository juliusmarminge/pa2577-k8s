$PODNAME = (kubectl get pods | Select-String -Pattern '^wms-mysql' | ForEach-Object { $_.Line -split ' ' })[0]
$MYSQL_ROOT_PASSWORD = "password"

# Create database if not exists
kubectl exec -it $PODNAME -- mysql -u root -p$MYSQL_ROOT_PASSWORD -e "CREATE DATABASE IF NOT EXISTS wms;"

# Copy migration files to pod
kubectl exec -it $PODNAME -- sh -c 'if [ -d /tmp/sql ]; then rm -rf /tmp/sql; fi'
kubectl exec -it $PODNAME -- sh -c 'mkdir -p /tmp/sql'
Get-ChildItem -Path ./mysql -Filter "*.sql" -Recurse | ForEach-Object { kubectl cp $_.FullName $PODNAME:/tmp/sql/ }

# Run migration files
kubectl exec -it $PODNAME -- sh -c 'for f in /tmp/sql/*.sql; do mysql -u root -p$MYSQL_ROOT_PASSWORD wms < "$f"; done'