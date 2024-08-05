using MongoDB.Driver;
using MongoDB.Bson;
namespace Kamran_Portfolio.Data
{
    public class MongoDBclass
    {
        const string connectionUri = "mongodb+srv://kamranalinaghicanada:xzECJ27nFiVQprEu@cluster0.kmvc3oo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
        MongoClientSettings settings = MongoClientSettings.FromConnectionString(connectionUri);

        
        public void Connection()
        {
            // Set the ServerApi field of the settings object to set the version of the Stable API on the client
            settings.ServerApi = new ServerApi(ServerApiVersion.V1);

            // Create a new client and connect to the server
            MongoClient? client = new MongoClient(settings);
            // Send a ping to confirm a successful connection
            try
            {
                var result = client.GetDatabase("admin").RunCommand<BsonDocument>(new BsonDocument("ping", 1));
                Console.WriteLine("Pinged your deployment. You successfully connected to MongoDB!");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }

    }
}
