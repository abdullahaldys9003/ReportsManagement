#cd ~/storage/shared

mcs -r:System.Net.Http -r:System.Web.Extensions -r:System.Runtime.Serialization Program.cs



mcs -r:System.Net.Http -r:System.Web.Extensions -r:System.Runtime.Serialization -r:System.Xml Program.cs



http://192.168.1.105:8089/mysqladmin/index.php?route=/&route=%2F