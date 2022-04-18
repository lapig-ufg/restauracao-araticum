{
    "Hostname": "app_araticum",
    "Names": "app_araticum",
    "Image": "registry.lapig.iesa.ufg.br/lapig-images-prod/app_araticum:latest",
    "Tty": true,
    "ExposedPorts": {
        "3000/tcp": { }
    },
    "HostConfig": {
        "Mounts": [
            {
                "Type": "bind",
                "Source": "/data/storage",
                "Target": "/STORAGE",
                "ReadOnly": false
            },
            {
                "Type": "bind",
                "Source": "/etc/localtime",
                "Target": "/etc/localtime",
                "ReadOnly": false
            },
            {
                "Type": "bind",
                "Source": "/data/containers/APP_ARATICUNS/APP/.env",
                "Target": "/APP/restauracao-araticum/src/server/.env",
                "ReadOnly": false
            },
            {
                "Type": "bind",
                "Source": "/data/containers/APP_ARATICUNS/APP/Monitora.sh",
                "Target": "/APP/Monitora.sh",
                "ReadOnly": false
            }
        ],
        "PortBindings": { "": [{ "HostPort": "" }]}
    },
"NetworkingConfig": {
    "EndpointsConfig": {
        "rede_lapig" : {
            "IPAMConfig": {
                "IPv4Address":"172.18.0.20"
            }

        }
    }
}
}
