"""
Variables related to fusion auth
Should be replaced with those coming from your own application
"""
api_key = "BjUUZr3jCamJ1pDbY5H_i-THJukoJOjjePArkSCPyztyaYiiyXZOienO"
client_id = "338ae21f-1f98-4279-ab9b-6906191d0a10"
client_secret = "4awzcPLqBc5Ex-3rwhP8DgtAZWHANiXLR62I-GT1-z8"
host_ip = "localhost"
client_port = 3000
server_port = 5000
fusionAuth_port = 9011
fusionauth_address = f"http://{host_ip}:{fusionAuth_port}"
access_token = None
redirect_uri = f"http%3A%2F%2F{host_ip}%3A{server_port}%2Foauth-callback"