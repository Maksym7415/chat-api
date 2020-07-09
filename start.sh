
#!/bin/bash

npm run start
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start my_first_process: $status"
  exit $status
fi

npx sequelize db:migrate
if [ $status -ne 0 ]; then
  echo "Failed to start my_first_process: $status"
  exit $status
fi
done