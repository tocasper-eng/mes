USE [claude]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[mes_CSLA]') AND type in (N'U'))
    DROP TABLE [dbo].[mes_CSLA]
GO
CREATE TABLE [dbo].[mes_CSLA](
	[LSTAR] [nvarchar](6)    NOT NULL,--作業編號
	[LTEXT] [nvarchar](50)       NULL, --作業名稱
	[remark] [nvarchar](100)     NULL --備註說明

 CONSTRAINT [PK_mes_CSLA] PRIMARY KEY CLUSTERED 
(
	 
	[LSTAR] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/* 
insert into mes_CSLA ( LSTAR , LTEXT , remark) 
values  
('W100','W-Direct labor rate',''), 
('W200','W-Indirect labor rat',''),
('W300','W-Fix OH rate','')	 ,    
('W400','W-Variable OH rate','')
*/