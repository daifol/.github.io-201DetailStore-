const products=[
{id:1,name:"Shampoo Premium",category:"Lavado exterior",presentation:"1 Litro",price:12500},
{id:2,name:"Snow Foam",category:"Lavado exterior",presentation:"1 Litro",price:14800},
{id:3,name:"APC Limpiador Multiuso",category:"Interior",presentation:"1 Litro",price:11200},
{id:4,name:"Limpia Tapizados",category:"Interior",presentation:"1 Litro",price:10900},
{id:5,name:"Limpia Llantas",category:"Neumáticos y llantas",presentation:"1 Litro",price:13900},
{id:6,name:"Abrillantador de Neumáticos",category:"Neumáticos y llantas",presentation:"1 Litro",price:12900},
{id:7,name:"Quick Detailer",category:"Brillo y protección",presentation:"500 ml",price:11800},
{id:8,name:"Cera Líquida",category:"Brillo y protección",presentation:"500 ml",price:15500},
{id:9,name:"Descontaminante Férrico",category:"Detailing",presentation:"1 Litro",price:17600},
{id:10,name:"Limpiador de Motor",category:"Detailing",presentation:"1 Litro",price:13200},
{id:11,name:"Sellador Cerámico",category:"Brillo y protección",presentation:"500 ml",price:22900},
{id:12,name:"Acondicionador de Plásticos",category:"Interior",presentation:"500 ml",price:12100}
];
let cart=JSON.parse(localStorage.getItem("201cart")||"[]");
const money=n=>n.toLocaleString("es-AR",{style:"currency",currency:"ARS",maximumFractionDigits:0});
function save(){localStorage.setItem("201cart",JSON.stringify(cart));updateCount()}
function updateCount(){document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0)}
function renderProducts(){
 const q=document.getElementById("search").value.toLowerCase();
 const c=document.getElementById("category").value;
 const list=products.filter(p=>(!q||p.name.toLowerCase().includes(q)||p.category.toLowerCase().includes(q))&&(!c||p.category===c));
 document.getElementById("productTotal").textContent=list.length+" productos";
 document.getElementById("products").innerHTML=list.map(p=>`<article class="card"><div class="photo">TOXICIDAD SHINE</div><div class="info"><span class="category">${p.category}</span><h3>${p.name}</h3><small>${p.presentation}</small><div class="price">${money(p.price)}</div><button class="add" onclick="add(${p.id})">Agregar al carrito</button></div></article>`).join("");
}
function add(id){const p=products.find(x=>x.id===id);const x=cart.find(x=>x.id===id);x?x.qty++:cart.push({...p,qty:1});save();openCart()}
function change(id,d){const x=cart.find(x=>x.id===id);if(!x)return;x.qty+=d;if(x.qty<=0)cart=cart.filter(y=>y.id!==id);save();renderCart()}
function total(){return cart.reduce((s,x)=>s+x.price*x.qty,0)}
function renderCart(){
 const el=document.getElementById("cartItems");
 if(!cart.length){el.innerHTML='<div class="empty">Tu carrito está vacío.</div>';document.getElementById("cartTotal").textContent=money(0);return}
 el.innerHTML=cart.map(x=>`<div class="cart-row"><div><b>${x.name}</b><br><small>${money(x.price)} c/u</small></div><div class="qty"><button onclick="change(${x.id},-1)">−</button> ${x.qty} <button onclick="change(${x.id},1)">+</button></div><b>${money(x.price*x.qty)}</b></div>`).join("");
 document.getElementById("cartTotal").textContent=money(total());
}
function openCart(){renderCart();document.getElementById("cartModal").classList.remove("hidden")}
function closeCart(){document.getElementById("cartModal").classList.add("hidden")}
function checkout(){
 if(!cart.length)return;
 closeCart();
 document.getElementById("checkoutSummary").innerHTML="<b>Resumen:</b> "+cart.map(x=>`${x.name} x${x.qty}`).join(", ")+"<br><br><b>Total: "+money(total())+"</b>";
 document.getElementById("checkoutModal").classList.remove("hidden");
}
function closeCheckout(){document.getElementById("checkoutModal").classList.add("hidden")}
document.getElementById("checkoutForm").addEventListener("submit",e=>{
 e.preventDefault();
 const data=Object.fromEntries(new FormData(e.target));
 const pedido={numero:"201-"+Date.now().toString().slice(-6),fecha:new Date().toLocaleString("es-AR"),cliente:data,items:cart,total:total()};
 const msg=`PEDIDO ${pedido.numero}\nCliente: ${data.name}\nWhatsApp: ${data.phone}\nEntrega: ${data.address}\nPago: ${data.payment}\nTotal: ${money(pedido.total)}\n\n`+cart.map(x=>`- ${x.name} x${x.qty} = ${money(x.price*x.qty)}`).join("\n");
 alert("Pedido generado correctamente.\\n\\n"+msg+"\\n\\nEn la versión final este pedido se enviará automáticamente a tu WhatsApp/panel de administración.");
 console.log(pedido);
 cart=[];save();closeCheckout();e.target.reset();
});
renderProducts();updateCount();
