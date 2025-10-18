// BLL/NeighborhoodService.cs
using System.Collections.Generic;
using DepartmentsSystem.Models;
using DepartmentsSystem.DAL;

namespace DepartmentsSystem.BLL
{
    public class NeighborhoodService
    {
        public List<Neighborhood> GetNeighborhoods() => NeighborhoodDAL.GetAll();
        public Neighborhood GetNeighborhood(int id) => NeighborhoodDAL.GetById(id);
        public int AddNeighborhood(Neighborhood neighborhood) => NeighborhoodDAL.Insert(neighborhood);
        public bool UpdateNeighborhood(Neighborhood neighborhood) => NeighborhoodDAL.Update(neighborhood);
        public bool DeleteNeighborhood(int id) => NeighborhoodDAL.Delete(id);
    }
}