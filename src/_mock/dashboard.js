import { _mock } from "./_mock";

export const _recentActivities = [...Array(5)].map((_, index) => {
  const category = ['Android', 'Mac', 'Windows', 'Android', 'Mac'][index];

  const status = ['paid', 'out of date', 'progress', 'paid', 'paid'][index];

  return {
    title: category,
    id: _mock.id(index),
    image: _mock.image.avatar(index),
    date: _mock.time(index),
    quantity: _mock.number.nativeL(index),
    price: _mock.number.price(index),
    totalPrice: _mock.number.price(index) * _mock.number.nativeL(index),
    status,
  };
});
