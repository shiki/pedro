# Database

## Login Credentials

1. If there is no logged in user, generate a random GUID and use that as the identifier
2. If the user registers, merge all current anonymous data
3. If the user logs in (old user), remove everything and replace with the user's data
  * The Bring! app just removes everything and replaces all data with the logged-in data
4. If the user logs out, remove all data and log in as anonymous

* CloudKit API may not return a valid iCloud account because the user can disable iCloud
* I guess using iCloud user ID involves too much work with little benefit. I think it would be better if we just generate a GUID and use that as the identifier. 
* We will use _Login with Facebook_ and _Login with Google_. We will need to provide a way to define the email address to use.

