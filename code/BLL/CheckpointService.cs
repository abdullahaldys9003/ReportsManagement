// BLL/CheckpointService.cs
using System.Collections.Generic;
using DepartmentsSystem.Models;
using DepartmentsSystem.DAL;

namespace DepartmentsSystem.BLL
{
    public class CheckpointService
    {
        public List<Checkpoint> GetCheckpoints() => CheckpointDAL.GetAll();
        public void AddCheckpoint(Checkpoint checkpoint) => CheckpointDAL.Insert(checkpoint);
    }
}