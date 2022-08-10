module.exports.role = {
  storesuperadmin: 'storesuperadmin',
  storeadmin:'storeadmin',
  storeuser:'storeuser',
  shopeyeadmin:'shopeyeadmin',
  shopeyeuser:'shopeyeuser',
  superadmin:'superadmin',
  admin:'admin',
  user:'user'
}

module.exports.UserPermission = [
  {
    rolesAssigned: ["Admin", "StoreAdmin"],
    reqMethod: ["GET"],
    reqFullPath: "/stores",
  },
  {
    rolesAssigned: ["Admin", "StoreAdmin", "StoreUser"],
    reqMethod: ["GET"],
    reqFullPath: "/stores/:id",
  },
  {
    rolesAssigned: ["Admin", "StoreAdmin"],
    reqMethod: ["PUT", "PATCH"],
    reqFullPath: "/stores/:id",
  },
];