const qs = (s) => document.querySelector(s);
const qsa = (s) => document.querySelectorAll(s);

window.addEventListener('load', () => setTimeout(() => qs('#preloader').classList.add('hide'), 850));

qs('#themeBtn').addEventListener('click', function () {
  const light = document.body.classList.toggle('light-mode');
  this.querySelector('i').className = light ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
});

let counted = false;
function onScroll() {
  qsa('.reveal-left, .reveal-right, .reveal-up').forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.88) el.classList.add('visible');
  });
  if (!counted) {
    counted = true;
    qsa('.box31').forEach((c) => {
      const target = +c.dataset.target;
      let val = 0;
      const t = setInterval(() => {
        val += Math.ceil(target / 40);
        c.textContent = val >= target ? (clearInterval(t), target + '+') : val;
      }, 35);
    });
  }
}
window.addEventListener('scroll', onScroll);
onScroll();

qsa('.box60').forEach((btn) => {
  btn.addEventListener('click', () => {
    qsa('.box60').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    qsa('.box62').forEach((c) => c.classList.toggle('hide-item', f !== 'all' && c.dataset.category !== f));
  });
});

function btnLoad(btn, def, ok, cb) {
  if (btn.disabled) return;
  btn.disabled = true;
  btn.textContent = 'Loading...';
  setTimeout(() => {
    btn.textContent = ok;
    if (cb) cb();
    setTimeout(() => {
      btn.textContent = def;
      btn.disabled = false;
    }, 1500);
  }, 2000);
}

qsa('.action-btn').forEach((b) => b.addEventListener('click', () => btnLoad(b, b.dataset.text, 'Confirmed')));

const overlay = qs('#drawerOverlay');
const toggleDrawer = (el, open) => {
  el.classList.toggle('active', open);
  overlay.classList.toggle('active', open);
};
qs('#cartOpenBtn').onclick = () => toggleDrawer(qs('#cartDrawer'), true);
qs('#wishOpenBtn').onclick = () => toggleDrawer(qs('#wishDrawer'), true);
const closeAll = () => [qs('#cartDrawer'), qs('#wishDrawer')].forEach((d) => toggleDrawer(d, false));
qs('#cartCloseBtn').onclick = qs('#wishCloseBtn').onclick = overlay.onclick = closeAll;

let cart = [];
let wish = [];

function renderList(list, box, countEl, emptyMsg, iconCls, isCart) {
  countEl.textContent = list.length;
  if (!list.length) {
    box.innerHTML = `<p class="box124">${emptyMsg}</p>`;
    if (isCart) qs('#cartTotal').textContent = '$0.00';
    return;
  }
  box.innerHTML = list.map((item, i) => `
    <div class="drawer-card">
      <img src="${item.img}" alt="">
      <div class="drawer-info"><h4>${item.name}</h4><span>$${item.price}</span></div>
      <button class="drawer-remove" data-i="${i}"><i class="fa-solid ${iconCls}"></i></button>
    </div>`).join('');
  if (isCart) qs('#cartTotal').textContent = '$' + list.reduce((s, x) => s + +x.price, 0).toFixed(2);
  box.querySelectorAll('.drawer-remove').forEach((b) => {
    b.onclick = () => {
      list.splice(+b.dataset.i, 1);
      renderList(list, box, countEl, emptyMsg, iconCls, isCart);
    };
  });
}

const syncCart = () => renderList(cart, qs('#cartItems'), qs('#cartCount'), 'Your order tray is currently empty.', 'fa-trash', true);
const syncWish = () => renderList(wish, qs('#wishItems'), qs('#wishCount'), 'No favorite dishes saved yet.', 'fa-xmark', false);

qsa('.add-cart-btn').forEach((btn) => {
  btn.onclick = () => {
    const d = btn.closest('.box62').dataset;
    btnLoad(btn, 'Add to Order', 'Added', () => {
      cart.push({ id: d.id, name: d.name, price: d.price, img: d.img });
      syncCart();
    });
  };
});

qsa('.wish-toggle').forEach((btn) => {
  btn.onclick = () => {
    const d = btn.closest('.box62').dataset;
    const idx = wish.findIndex((w) => w.id === d.id);
    const active = idx === -1;
    active ? wish.push({ id: d.id, name: d.name, price: d.price, img: d.img }) : wish.splice(idx, 1);
    btn.classList.toggle('active', active);
    btn.querySelector('i').className = active ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
    syncWish();
  };
});

qs('#checkoutBtn').onclick = function () {
  if (cart.length) btnLoad(this, 'Place Order Now', 'Order Sent!', () => { cart = []; syncCart(); closeAll(); });
};

['#bookingForm', '#newsForm'].forEach((sel, i) => {
  const form = qs(sel);
  const btn = form.querySelector('button');
  form.onsubmit = (e) => {
    e.preventDefault();
    btnLoad(btn, i ? 'Join' : 'Confirm Reservation', i ? 'Joined!' : 'Table Booked!', () => form.reset());
  };
});