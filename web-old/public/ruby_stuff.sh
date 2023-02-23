#!/bin/bash

# Set up all required software 
brew install ruby postgresql
gem install rails
gem update --system

# initialize 
postgres -D /usr/local/var/postgres&
initdb /usr/local/var/postgres
/usr/local/Cellar/postgresql/9.5.3/bin/createuser -s postgres

# clone
git clone https://github.com/transcendent/labs-ror-training.git
cd labs-ror-training

bundle install
bundle exec rake db:create
bundle exec rake db:migrate
bundle exec rake db:seed
bundle exec rake

# Set up server. You should now be able to access http://localhost:3000
bundle exec rails s