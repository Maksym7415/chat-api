
#!/bin/bash

./node_modules/.bin/nodemon index.js
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start my_first_process: $status"
  exit $status
fi

./node_modules/.bin/sequelize db:migrate
if [ $status -ne 0 ]; then
  echo "Failed to start my_first_process: $status"
  exit $status
fi
done