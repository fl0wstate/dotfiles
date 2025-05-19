const vikingImgs = [
  "https://images.unsplash.com/photo-1535534234806-58f031487e33?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dmlraW5nfGVufDB8MHwwfHw%3D&auto=format&fit=crop&w=1440&q=60",

  "https://images.unsplash.com/photo-1615672968435-95ade28e0b38?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dmlraW5nfGVufDB8MHwwfHw%3D&auto=format&fit=crop&w=1440&q=60",

  "https://images.unsplash.com/photo-1566840849929-5a60a802788d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8dmlraW5nfGVufDB8MHwwfHw%3D&auto=format&fit=crop&w=1440&q=60",

  "https://images.unsplash.com/photo-1559552440-8e17304991e1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8dmlraW5nfGVufDB8MHwwfHw%3D&auto=format&fit=crop&w=1440&q=60",

  "https://images.unsplash.com/photo-1615672968910-90f554a4d607?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fHZpa2luZ3xlbnwwfDB8MHx8&auto=format&fit=crop&w=1440&q=60",

  "https://images.unsplash.com/photo-1615672968364-d59e8d4be430?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjJ8fHZpa2luZ3xlbnwwfDB8MHx8&auto=format&fit=crop&w=1440&q=60",

  "https://images.unsplash.com/photo-1517242296655-0a451dd85b30?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=869&q=80",

  "https://images.unsplash.com/photo-1628968415499-a27a3aa09289?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80",

  "https://images.unsplash.com/photo-1615672969026-ceaca023bc3b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",

  "https://images.unsplash.com/photo-1629144193916-0e14cc84a2aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80",

  "https://images.unsplash.com/photo-1630013890479-a2daa8131f87?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",

  "https://images.unsplash.com/photo-1476362555312-ab9e108a0b7e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",

  "https://images.unsplash.com/photo-1496163290419-406e5dd84a07?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",

  "https://images.unsplash.com/photo-1508435019585-b4397e835af9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",

  "https://images.unsplash.com/photo-1475070929565-c985b496cb9f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",

  "https://images.unsplash.com/photo-1483982258113-b72862e6cff6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",

  "https://images.unsplash.com/photo-1494376877685-d3d2559d4f82?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",

  "https://images.unsplash.com/photo-1536183922588-166604504d5e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80",

  "https://images.unsplash.com/photo-1479762937580-3b682a10a0d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80",

  "https://images.unsplash.com/photo-1493584753368-64a38a466b66?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",

  "https://images.unsplash.com/photo-1414759030024-7889df4b20f4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=912&q=80",

  "https://images.unsplash.com/photo-1489846986031-7cea03ab8fd0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=873&q=80",

  "https://images.unsplash.com/photo-1517921684659-7d5b995aaa44?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",

  "https://images.unsplash.com/photo-1493673272479-a20888bcee10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",

  "https://images.unsplash.com/photo-1478728073286-db190d3d8ce6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
];

export default vikingImgs;
