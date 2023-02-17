using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace ProEventos.Persistence.Models
{
    public class PageList<T> : List<T>
    {
        public int CurrentPage { get; set; }   
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }

        public PageList() {}
        
        public PageList(List<T> items, int count, int pageNumber, int pageSize)
        {
            TotalCount = count;
            PageSize = pageSize;
            CurrentPage = pageNumber;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize); // cálculo matemático do total de páginas
            AddRange(items); // como a classe herda de List<> , utilizamos um dos métodos da classe chamado AddRange           
        }

        public static async Task<PageList<T>> CreateAsync(
            IQueryable<T> source, int pageNumber, int PageSize
        )
        {
            var count = await source.CountAsync();
            var items = await source.Skip((pageNumber - 1) * PageSize)
                                    .Take(PageSize)
                                    .ToListAsync();
            return new PageList<T>(items, count, pageNumber, PageSize);                                    
        }
    }
}