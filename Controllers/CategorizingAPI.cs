using Kamran_Portfolio.Data.DataContexts;
using Kamran_Portfolio.Data.OtherData;
using Kamran_Portfolio.Data.Post_Parameters;
using Kamran_Portfolio.Models;
using Kamran_Portfolio.Models.Categorizing;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using Newtonsoft.Json;
using System.Data.Common;

namespace Kamran_Portfolio.Controllers
{
    public class CategorizingAPI : Controller
    {
        private CategorizingProjectContext _projectContext;
        private IHttpContextAccessor _contex;
        MongoClient MongoDB;
        IMongoCollection<CategorizingProjectModel> MongoProjects;

        public CategorizingAPI(IHttpContextAccessor contex)
        {
            _projectContext = new CategorizingProjectContext();
            _contex = contex;
            MongoDB = new MongoClient(GeneralData.ConnectionString);
            MongoProjects = MongoDB.GetDatabase(GeneralData.DatabaseName).GetCollection<CategorizingProjectModel>(GeneralData.TableName);
        }


        public IActionResult Index()
        {
            return View();
        }



        [HttpPost]
        public string Parameters()
        {
            return GetRequestBody(_contex.HttpContext.Request.Body);
        }


        [HttpPost]
        public string ListOfProjectsInMongoDB()
        {
            UserIdParam? u = GetRequestBody<UserIdParam>();
            if (u == null) { return "null"; }
            FilterDefinition<CategorizingProjectModel> filter = Builders<CategorizingProjectModel>.Filter.Eq(project => project.UserId, u._id);
            List<CategorizingProjectModel> result = MongoProjects.Find(filter).ToListAsync().Result;
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        [HttpPut]
        public string UpdateProjectInMongoDB()
        {
            CategorizingProjectModel? project = GetRequestBody<CategorizingProjectModel>();
            if (project != null && project.UserId > -1)
            {
                if (String.Equals(project._id.ToString(), "000000000000000000000000"))
                {
                    project._id = ObjectId.GenerateNewId();
                    MongoProjects.InsertOne(project);
                }
                else
                {
                    FilterDefinition<CategorizingProjectModel> filter = Builders<CategorizingProjectModel>.Filter.Eq(p => p._id, project._id);
                    UpdateDefinition<CategorizingProjectModel> update = Builders<CategorizingProjectModel>.Update
                        .Set(p => p.UserId, project.UserId)
                        .Set(p => p.ProductId, project.ProductId)
                        .Set(p => p.ProjectName, project.ProjectName)
                        .Set(p => p.ColumnList, project.ColumnList)
                        .Set(p => p.RowList, project.RowList);
                    MongoProjects.UpdateOne(filter, update);
                }
                return project._id.ToString();
            }
            else { return "null"; }
        }








        private T? GetRequestBody<T>()
        {
            if (_contex.HttpContext != null)
            {
                StreamReader streamReader = new StreamReader(_contex.HttpContext.Request.Body);
                string str = streamReader.ReadToEndAsync().Result;
                T p = BsonSerializer.Deserialize<T>(str);
                return p;
            }
            else { return default(T); }
        }

        private string GetRequestBody(Stream body)
        {
            StreamReader streamReader = new StreamReader(body);
            return streamReader.ReadToEndAsync().Result;
        }

        private UserInfo? GetUserInSession()
        {
            string? jsonUser = _contex.HttpContext.Session.GetString("user");
            if (jsonUser != null && jsonUser.Length > 0)
            {
                return JsonConvert.DeserializeObject<UserInfo>(jsonUser);
            }
            else { return null; }
        }
    }
}
