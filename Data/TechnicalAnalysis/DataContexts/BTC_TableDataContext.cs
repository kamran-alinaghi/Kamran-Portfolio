﻿using Kamran_Portfolio.Data.TechnicalAnalysis.DataModels;
using Kamran_Portfolio.Models;
using Microsoft.EntityFrameworkCore;

namespace Kamran_Portfolio.Data.TechnicalAnalysis.DataContexts
{
    public class BTC_TableDataContext: SuperBaseDBContext
    {
        public DbSet<BTC_Candles_KuCoin> BTC_KuCoin_DB { get; set; } = default!;
    }
}
