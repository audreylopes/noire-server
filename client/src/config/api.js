exports.routes = {
    'login': '/login',
    'logout': '/logout',
    'update profile': '/profile',
    'view user': '/admin/user/{id}',
    'view role': '/admin/role/{id}',
};

exports.XHR_OPTIONS = {
    TIMEOUT: 5000,
    VERBOSE: true,
    DEBUG: true
};