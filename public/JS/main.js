const addScript = ({ src, type = "text/javascript", defer = false, onload }) => {
    console.log("addScript", src);
    var script = document.createElement('script');
    script.setAttribute('src', src);
    script.setAttribute('type', type);
    script.setAttribute('defer', defer);
    script.onload = onload;
    document.head.appendChild(script);
}

const addLink = (href, rel = "stylesheet") => {
    console.log("addLink", href);
    var link = document.createElement('link');
    link.setAttribute('href', href);
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
}

addLink("https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css");
addScript({ src: "/JS/ventana-flotante/index.js" });

Iconos_fa_bs();
SweetAlert2();

function SweetAlert2() {
    addScript({ src: "https://cdn.jsdelivr.net/npm/sweetalert2@11.7.27/dist/sweetalert2.all.min.js" });
    addLink("https://cdn.jsdelivr.net/npm/@sweetalert2/theme-material-ui/material-ui.css");
}

function Iconos_fa_bs() {
    addLink("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");
    addLink("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css");
}