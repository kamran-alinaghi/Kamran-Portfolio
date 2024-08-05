using Kamran_Portfolio.Data.DataContexts;
using Kamran_Portfolio.Data.OtherData;
using Kamran_Portfolio.Data.Post_Parameters;
using Kamran_Portfolio.Models;
using Kamran_Portfolio.Models.Categorizing;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Newtonsoft.Json;
using System.Data.Common;

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
            return JsonConvert.SerializeObject(null);
        }

        [HttpPost]
        public string CreatedProjects()
        {
            IdParams? parameters = JsonConvert.DeserializeObject<IdParams>(GetRequestBody(_contex.HttpContext.Request.Body));
            if (parameters != null && parameters.Id > 0)
            {
                return JsonConvert.SerializeObject(GetProjectsOfUser(parameters.Id), Formatting.Indented);
            }
            return JsonConvert.SerializeObject(null);
        }

        [HttpPost]
        public string Columns()
        {
            IdParams? param = JsonConvert.DeserializeObject<IdParams>(GetRequestBody(_contex.HttpContext.Request.Body));
            if (param != null && param.Id > 0)
            {
                return JsonConvert.SerializeObject(GetColumnsForProject(param.Id));
            }
            return JsonConvert.SerializeObject(null);
        }

        [HttpPost]
        public string Rows()
        {
            IdParams? param = JsonConvert.DeserializeObject<IdParams>(GetRequestBody(_contex.HttpContext.Request.Body));
            if (param != null && param.Id > 0)
            {
                return JsonConvert.SerializeObject(GetRowsForProject(param.Id));
            }
            return JsonConvert.SerializeObject(null);
        }

        [HttpPost]
        public string Values()
        {
            IdParams? param = JsonConvert.DeserializeObject<IdParams>(GetRequestBody(_contex.HttpContext.Request.Body));
            if (param != null && param.Id > 0)
            {
                return JsonConvert.SerializeObject(GetValuesForProject(param.Id));
            }
            return JsonConvert.SerializeObject(null);
        }

        [HttpPost]
        public string Parameters()
        {
            return GetRequestBody(_contex.HttpContext.Request.Body);
        }

        [HttpPut]
        public string PutDataToDb()
        {
            int t = -1;
            TableContentDbTheme? param = JsonConvert.DeserializeObject<TableContentDbTheme>(GetRequestBody(_contex.HttpContext.Request.Body));
            if (param != null && param.TableId > -1)
            {
                t = UpdateCreatedProjectsInDb(param.userId,param.TableId,param.TableName);
                UpdateColumnsInDb(param.TableId, param.ColumnList);
                UpdateRowsInDb(param.TableId, param.RowList);
                UpdateValuesInDb(param.TableId, param.ColumnList, param.RowList);
            }
            return JsonConvert.SerializeObject(t);
        }

        






        private int UpdateCreatedProjectsInDb(TableContentDbTheme paramObj)
        {
            int modifiedId = -1;
            var res = from p in _projectContext.UserDefinedProjects
                      where p.Id == paramObj.TableId
                      select p;
            if (res != null && res.Any())
            {
                var project = res.First();
                project.ProjectName = paramObj.TableName;
                modifiedId = project.Id;
            }
            else
            {
                UserDefinedProjectModel projectModel = new UserDefinedProjectModel();
                projectModel.Id = GetLastID(TableNames.UserDefinedProjects) + 1;
                projectModel.ProjectName = paramObj.TableName;
                projectModel.ProductId = 1;
                projectModel.UserId = paramObj.userId;
                _projectContext.UserDefinedProjects.Add(projectModel);
                modifiedId = projectModel.Id;
            }
            _projectContext.SaveChanges();

            UpdateColumnsInDb(paramObj);

            return modifiedId;
        }

        private void UpdateColumnsInDb(TableContentDbTheme paramObj)
        {
            for (int i = 0; i < paramObj.ColumnList.Count - 1; i++)
            {
                var DbColumn = from c in _projectContext.Categorizing_Columns
                               where c.Id == paramObj.ColumnList[i].Id
                               select c;
                if (DbColumn != null && DbColumn.Any())
                {
                    ColumnModel cm = DbColumn.First();
                    cm.ColumnName = paramObj.ColumnList[i].Title;
                    cm.IsBoolean = paramObj.ColumnList[i].nOrQ;
                    cm.UserDefinedProjectId = paramObj.TableId;
                }
                else
                {
                    ColumnModel cmNew = new ColumnModel();
                    cmNew.ColumnName = paramObj.ColumnList[i].Title;
                    cmNew.IsBoolean = paramObj.ColumnList[i].nOrQ;
                    cmNew.UserDefinedProjectId = paramObj.TableId;
                    cmNew.Id = GetLastID(TableNames.Column) + 1;
                    paramObj.ColumnList[i].Id = cmNew.Id;
                    _projectContext.Add(cmNew);
                }
                _projectContext.SaveChanges();
            }

            var columnQuery = from c in _projectContext.Categorizing_Columns
                              where c.UserDefinedProjectId == paramObj.TableId
                              select c;
            if (columnQuery.Any() && columnQuery != null)
            {
                foreach (var dbColumn in columnQuery)
                {
                    bool canDel = true;
                    for (int i = 0; i < paramObj.ColumnList.Count; i++) { if (dbColumn.Id == paramObj.ColumnList[i].Id) { canDel = false; break; } }
                    if (canDel)
                    {
                        _projectContext.Remove(dbColumn);
                        var toDelete = from v in _projectContext.Categorizing_Values
                                       where v.ColumnId == dbColumn.Id && v.UserDefinedProjectId == paramObj.TableId
                                       select v;
                        if (toDelete.Any() && toDelete != null)
                        {
                            foreach (var delMember in toDelete)
                            {
                                _projectContext.Remove(delMember);
                            }
                        }
                    }
                }
                _projectContext.SaveChanges();

                UpdateRowsInDb(paramObj);
            }
        }

        private void UpdateRowsInDb(TableContentDbTheme paramObj)
        {
            for (int i = 0; i < paramObj.RowList.Count - 1; i++)
            {
                var DbRows = from r in _projectContext.Categorizing_RowNames
                             where r.Id == paramObj.RowList[i].Id
                             select r;
                if (DbRows.Any() && DbRows != null)
                {
                    RowModel rc = DbRows.First();
                    rc.RowName = paramObj.RowList[i].Name;
                    rc.UserDefinedProjectId = paramObj.TableId;
                }
                else
                {
                    RowModel rcNew = new RowModel();
                    rcNew.RowName = paramObj.RowList[i].Name;
                    rcNew.UserDefinedProjectId = paramObj.TableId;
                    rcNew.Id = GetLastID(TableNames.Row) + 1;
                    paramObj.RowList[i].Id = rcNew.Id;
                    _projectContext.Add(rcNew);
                }
                _projectContext.SaveChanges();
            }
            var rowQuery = from r in _projectContext.Categorizing_RowNames
                           where r.UserDefinedProjectId == paramObj.TableId
                           select r;
            if (rowQuery.Any() && rowQuery != null)
            {
                foreach (var row in rowQuery)
                {
                    bool canDel = true;
                    for (int i = 0; i < paramObj.RowList.Count; i++) { if (row.Id == paramObj.RowList[i].Id) { canDel = false; break; } }
                    if (canDel)
                    {
                        _projectContext.Remove(row);
                        var toDelete = from v in _projectContext.Categorizing_Values
                                       where v.RowId == row.Id && v.UserDefinedProjectId == paramObj.TableId
                                       select v;
                        if (toDelete.Any() && toDelete != null)
                        {
                            foreach (var delMember in toDelete)
                            {
                                _projectContext.Remove(delMember);
                            }
                        }
                    }
                }
                _projectContext.SaveChanges();

                UpdateValuesInDb(paramObj);
            }
        }

        private void UpdateValuesInDb(TableContentDbTheme paramObj)
        {
            List<int> ColIndexes = new List<int>();
            for (int i = 0; i < paramObj.ColumnList.Count - 1; i++) { ColIndexes.Add(paramObj.ColumnList[i].Id); }
            for (int i = 0; i < paramObj.RowList.Count - 1; i++)
            {
                for (int j = 0; j < paramObj.RowList[i].Properties.Count; j++)
                {
                    var dbVal = from v in _projectContext.Categorizing_Values
                                where v.UserDefinedProjectId == paramObj.TableId && v.RowId == paramObj.RowList[i].Id && v.ColumnId == ColIndexes[j]
                                select v;
                    if (dbVal != null && dbVal.Any())
                    {
                        var valTochange = dbVal.First();
                        valTochange.Value = paramObj.RowList[i].Properties[j].NumVal;
                    }
                    else
                    {
                        ValuesModel vm = new ValuesModel();
                        vm.Id = GetLastID(TableNames.Values) + 1;
                        vm.ColumnId = ColIndexes[j];
                        vm.RowId = paramObj.RowList[i].Id;
                        vm.UserDefinedProjectId = paramObj.TableId;
                        vm.Value = paramObj.RowList[i].Properties[j].NumVal;
                        _projectContext.Add(vm);
                    }
                    _projectContext.SaveChanges();
                }
            }
        }







        private void UpdateValuesInDb(int UserDefinedProjectsId, List<ColumnContent> tableColumns, List<RowContent> tableRows)
        {
            List<int> ColIndexes = new List<int>();
            for (int i = 0; i < tableColumns.Count - 1; i++) { ColIndexes.Add(tableColumns[i].Id); }
            for (int i = 0; i < tableRows.Count - 1; i++)
            {
                for (int j = 0; j < tableRows[i].Properties.Count; j++)
                {
                    var dbVal = from v in _projectContext.Categorizing_Values
                                where v.UserDefinedProjectId == UserDefinedProjectsId && v.RowId == tableRows[i].Id && v.ColumnId == ColIndexes[j]
                                select v;
                    if (dbVal != null && dbVal.Any())
                    {
                        var valTochange = dbVal.First();
                        valTochange.Value = tableRows[i].Properties[j].NumVal;
                    }
                    else
                    {
                        ValuesModel vm = new ValuesModel();
                        vm.Id = GetLastID(TableNames.Values) + 1;
                        vm.ColumnId = ColIndexes[j];
                        vm.RowId = tableRows[i].Id;
                        vm.UserDefinedProjectId = UserDefinedProjectsId;
                        vm.Value = tableRows[i].Properties[j].NumVal;
                        _projectContext.Add(vm);
                    }
                    _projectContext.SaveChanges();
                }
            }
        }


        private void UpdateRowsInDb(int UserDefinedProjectsId, List<RowContent> tableRows)
        {
            for (int i = 0; i < tableRows.Count - 1; i++)
            {
                var DbRows = from r in _projectContext.Categorizing_RowNames
                             where r.Id == tableRows[i].Id
                             select r;
                if (DbRows.Any() && DbRows != null)
                {
                    RowModel rc = DbRows.First();
                    rc.RowName = tableRows[i].Name;
                    rc.UserDefinedProjectId = UserDefinedProjectsId;
                }
                else
                {
                    RowModel rcNew = new RowModel();
                    rcNew.RowName = tableRows[i].Name;
                    rcNew.UserDefinedProjectId = UserDefinedProjectsId;
                    rcNew.Id = GetLastID(TableNames.Row) + 1;
                    tableRows[i].Id = rcNew.Id;
                    _projectContext.Add(rcNew);
                }
                _projectContext.SaveChanges();
            }
            var rowQuery = from r in _projectContext.Categorizing_RowNames
                           where r.UserDefinedProjectId == UserDefinedProjectsId
                           select r;
            if (rowQuery.Any() && rowQuery != null)
            {
                IList<RowModel> tempQ = rowQuery.ToList();
                foreach (var row in tempQ)
                {
                    bool canDel = true;
                    for (int i = 0; i < tableRows.Count - 1; i++) { if (row.Id == tableRows[i].Id) { canDel = false; break; } }
                    if (canDel)
                    {
                        var toDelete = from v in _projectContext.Categorizing_Values
                                       where v.RowId == row.Id && v.UserDefinedProjectId == UserDefinedProjectsId
                                       select v;
                        if (toDelete.Any() && toDelete != null)
                        {
                            foreach (var delMember in toDelete)
                            {
                                _projectContext.Remove(delMember);
                            }
                            _projectContext.SaveChanges();
                        }
                        _projectContext.Remove(row);
                        _projectContext.SaveChanges();
                    }
                }
                _projectContext.SaveChanges();
            }
        }


        private void UpdateColumnsInDb(int UserDefinedProjectsId, List<ColumnContent> tableColumns)
        {
            for (int i = 0; i < tableColumns.Count - 1; i++)
            {
                var DbColumn = from c in _projectContext.Categorizing_Columns
                               where c.Id == tableColumns[i].Id
                               select c;
                if (DbColumn != null && DbColumn.Any())
                {
                    ColumnModel cm = DbColumn.First();
                    cm.ColumnName = tableColumns[i].Title;
                    cm.IsBoolean = tableColumns[i].nOrQ;
                }
                else
                {
                    ColumnModel cmNew = new ColumnModel();
                    cmNew.ColumnName = tableColumns[i].Title;
                    cmNew.IsBoolean = tableColumns[i].nOrQ;
                    cmNew.UserDefinedProjectId = UserDefinedProjectsId;
                    cmNew.Id = GetLastID(TableNames.Column) + 1;
                    tableColumns[i].Id = cmNew.Id;
                    _projectContext.Add(cmNew);
                }
                _projectContext.SaveChanges();
            }

            var columnQuery = from c in _projectContext.Categorizing_Columns
                              where c.UserDefinedProjectId == UserDefinedProjectsId
                              select c;
            if (columnQuery.Any() && columnQuery != null)
            {
                IList<ColumnModel> tempQ = columnQuery.ToList();
                foreach (var dbColumn in tempQ)
                {
                    bool canDel = true;
                    for (int i = 0; i < tableColumns.Count - 1; i++) { if (dbColumn.Id == tableColumns[i].Id) { canDel = false; break; } }
                    if (canDel)
                    {
                        var toDelete = from v in _projectContext.Categorizing_Values
                                       where v.ColumnId == dbColumn.Id && v.UserDefinedProjectId == UserDefinedProjectsId
                                       select v;
                        if (toDelete.Any() && toDelete != null)
                        {
                            foreach (var delMember in toDelete)
                            {
                                _projectContext.Remove(delMember);
                            }
                            _projectContext.SaveChanges();
                        }
                        _projectContext.Remove(dbColumn);
                        _projectContext.SaveChanges();
                    }
                }
                _projectContext.SaveChanges();
            }
        }

        private int UpdateCreatedProjectsInDb(int userId, int UserDefinedProjectsId, string Name)
        {
            int modifiedId = -1;
            var res = from p in _projectContext.UserDefinedProjects
                      where p.Id == UserDefinedProjectsId
                      select p;
            if (res != null && res.Any())
            {
                var project = res.First();
                project.ProjectName = Name;
                modifiedId = project.Id;
            }
            else
            {
                UserDefinedProjectModel projectModel = new UserDefinedProjectModel();
                projectModel.Id = GetLastID(TableNames.UserDefinedProjects) + 1;
                projectModel.ProjectName = Name;
                projectModel.ProductId = 1;
                projectModel.UserId = userId;
                _projectContext.UserDefinedProjects.Add(projectModel);
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
            if (res != null && res.Any()) { return res.ToList(); }
            else { return null; }
        }

        private List<RowModel>? GetRowsForProject(int Id)
        {
            var res = from col in _projectContext.Categorizing_RowNames
                      where col.UserDefinedProjectId == Id
                      select col;
            if (res != null && res.Any()) { return res.ToList(); }
            else { return null; }
        }

        private List<ColumnModel>? GetColumnsForProject(int Id)
        {
            var res = from col in _projectContext.Categorizing_Columns
                      where col.UserDefinedProjectId == Id
                      select col;
            if (res != null && res.Any()) { return res.ToList(); }
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
        private int GetLastID(TableNames table)
        {
            IQueryable<int> res;
            switch (table)
            {
                case TableNames.Column:
                    res = from l in _projectContext.Categorizing_Columns
                          select l.Id;
                    break;
                case TableNames.Row:
                    res = from l in _projectContext.Categorizing_RowNames
                          select l.Id;
                    break;
                case TableNames.Values:
                    res = from l in _projectContext.Categorizing_Values
                          select l.Id;
                    break;
                case TableNames.UserDefinedProjects:
                    res = from l in _projectContext.UserDefinedProjects
                          select l.Id;
                    break;
                default:
                    res = from l in _projectContext.UserProducts
                          select l.Id;
                    break;
            }

            if (res != null && res.Any()) { return res.Max(); }
            else { return 0; }
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
