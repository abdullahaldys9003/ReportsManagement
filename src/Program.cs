using System;
using System.Net.Http;
using System.Collections.Generic;
using System.Threading.Tasks;

class Program
{
    static async Task Main(string[] args)
    {
        using (HttpClient client = new HttpClient())
        {
            var values = new Dictionary<string, string>
            {
                { "name", "Ahmed" },
                { "email", "ahmed@example.com" }
            };

            var content = new FormUrlEncodedContent(values);
            var response = await client.PostAsync("http://yourserver.com/api.php", content);
            string responseString = await response.Content.ReadAsStringAsync();

            Console.WriteLine("Response: " + responseString);
        }
    }
}

/*
mcs -r:System.Net.Http.dll Program.cs
mono Program.exe
*/