let roles = {
    admin: {
        can: ['edit-user', 'delete-user', 'edit-track', 'delete-track'],
        inherits: ['distributor']
    },
    distributor: {
        can: ['upload-track', 'edit-owned-track', 'delete-owned-track'],
        inherits: ['default']
    },
    default: {
        can: ['edit-self', 'delete-self']
    }
};

module.exports = roles;