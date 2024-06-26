﻿using Kamran_Portfolio.Data.DataContexts;
using Kamran_Portfolio.Data.OtherData;
using Kamran_Portfolio.Data.Post_Parameters;
using Kamran_Portfolio.Models;
using Kamran_Portfolio.Models.Categorizing;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Kamran_Portfolio.Controllers
{
    public class CategorizingAPI : Controller
    {
        private CategorizingProjectContext _projectContext;
        private IHttpContextAccessor _contex;

        public CategorizingAPI(IHttpContextAccessor contex)
        {
            _projectContext = new CategorizingProjectContext();
            _contex = contex;
        }


        public IActionResult Index()
        {
            return View();
        }


        [HttpPost]
        public string PurchasedProducts()
        {
            IdParams? parameters = JsonConvert.DeserializeObject<IdParams>(GetRequestBody(_contex.HttpContext.Request.Body));
            if (parameters != null && parameters.Id > 0)
            {
                return JsonConvert.SerializeObject(GetProductsOfUser(parameters.Id));
            }
            return "Not Found";
        }

        [HttpPost]
        public string CreatedProjects()
        {
            IdParams? parameters = JsonConvert.DeserializeObject<IdParams>(GetRequestBody(_contex.HttpContext.Request.Body));
            if (parameters != null && parameters.Id > 0)
            {
                return JsonConvert.SerializeObject(GetProjectsOfUser(parameters.Id), Formatting.Indented);
            }
            return "Not Found";
        }

        [HttpPost]
        public string Columns()
        {
            IdParams? param = JsonConvert.DeserializeObject<IdParams>(GetRequestBody(_contex.HttpContext.Request.Body));
            if (param != null && param.Id > 0)
            {
                return JsonConvert.SerializeObject(GetColumnsForProject(param.Id));
            }
            return "Not Found";
        }

        [HttpPost]
        public string Rows()
        {
            IdParams? param = JsonConvert.DeserializeObject<IdParams>(GetRequestBody(_contex.HttpContext.Request.Body));
            if (param != null && param.Id > 0)
            {
                return JsonConvert.SerializeObject(GetRowsForProject(param.Id));
            }
            return "Not Found";
        }

        [HttpPost]
        public string Values()
        {
            IdParams? param = JsonConvert.DeserializeObject<IdParams>(GetRequestBody(_contex.HttpContext.Request.Body));
            if (param != null && param.Id > 0)
            {
                return JsonConvert.SerializeObject(GetValuesForProject(param.Id));
            }
            return "Not Found";
        }

        [HttpPost]
        public string Parameters()
        {
            return GetRequestBody(_contex.HttpContext.Request.Body);
        }

        [HttpPut]
        public string PutDataToDb()
        {
            int? t = -1;
            TableContentDbTheme? param = JsonConvert.DeserializeObject<TableContentDbTheme>(GetRequestBody(_contex.HttpContext.Request.Body));
            if (param != null && param.TableId > -1)
            {
                t=UpdateCreatedProjects(param.userId, param.TableId,param.TableName);
                //add or select name 
            }
            if (t != null) { return JsonConvert.SerializeObject(t); }
            else { return "none"; }
        }











        private int? UpdateCreatedProjects(int userId, int tableId, string Name)
        {
            int? modifiedId = -1;
            var res=from p in _projectContext.UserDefinedProjects
                    where p.Id == tableId
                    select p;
            if (res.Any())
            {
                var project =res.First();
                project.ProjectName = Name;
                modifiedId = project.Id;
            }
            else
            {
                UserDefinedProjectModel projectModel = new UserDefinedProjectModel();
                projectModel.Id = GetLastID() + 1;
                projectModel.ProjectName = Name;
                projectModel.ProductId = 1;
                projectModel.UserId = userId;
                _projectContext.Add(projectModel);
                modifiedId = projectModel.Id;
            }
            _projectContext.SaveChanges();
            return modifiedId;
        }


        private List<ValuesModel>? GetValuesForProject(int Id)
        {
            var res = from col in _projectContext.Categorizing_Values
                      where col.UserDefinedProjectId == Id
                      select col;
            if (res.Any()) { return res.ToList(); }
            else { return null; }
        }

        private List<RowModel>? GetRowsForProject(int Id)
        {
            var res = from col in _projectContext.Categorizing_RowNames
                      where col.UserDefinedProjectId == Id
                      select col;
            if (res.Any()) { return res.ToList(); }
            else { return null; }
        }

        private List<ColumnModel>? GetColumnsForProject(int Id)
        {
            var res = from col in _projectContext.Categorizing_Columns
                      where col.UserDefinedProjectId == Id
                      select col;
            if (res.Any()) { return res.ToList(); }
            else { return null; }
        }


        private string GetRequestBody(Stream body)
        {
            StreamReader streamReader = new StreamReader(body);
            return streamReader.ReadToEndAsync().Result;
        }

        private List<UserDefinedProjectModel>? GetProjectsOfUser(int id)
        {
            var res = from l in _projectContext.UserDefinedProjects
                      where l.UserId == id
                      select l;
            if (res != null && res.Any())
            {
                return res.ToList<UserDefinedProjectModel>();
            }
            return null;
        }

        private List<UserProductsModel>? GetProductsOfUser(int userId)
        {
            var res = from l in _projectContext.UserProducts
                      where l.UserId == userId
                      select l;
            if (res != null && res.Any())
            {
                return res.ToList<UserProductsModel>();
            }
            return null;
        }

        private List<ProductItemsModel>? GetProductName()
        {
            var res = from row in _projectContext.ProductItems
                      select row;
            if (res != null && res.Any())
            {
                return res.ToList<ProductItemsModel>();
            }
            return null;
        }
        private int GetLastID()
        {
            var res = from l in _projectContext.UserDefinedProjects
                      select l.Id;
            return res.Max();
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
