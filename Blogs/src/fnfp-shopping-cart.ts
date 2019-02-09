// https://fsharpforfunandprofit.com/csharp/union-types-in-csharp.html

interface Product {
  readonly productId: number;
  readonly productName: string;
  readonly amount: number;
}

interface Payment {
}

class CreditCard implements Payment {}
class PayPal implements Payment {}

interface Transition<TArg extends CartState> {
  (state: TArg): Promise<CartState>;
}

interface Transitions {
  empty: Transition<CartStateEmpty>;
  active: Transition<CartStateActive>;
  paid: Transition<CartStatePaid>;
}

interface CartState {
  transition(transitions: Transitions): Promise<CartState>;
  json(): string;
}

class CartStateEmpty implements CartState {

  public add(product: Product): CartState {
    const cartState = new CartStateActive();
    cartState.add(product);
    return cartState;
  }

  public async transition({ empty }: Transitions): Promise<CartState> {
    return empty(this);
  }

  public json(): string {
    return JSON.stringify({
      products: [],
    });
  }
}

class CartStateActive implements CartState {
  private products: Product[] = [];

  public add(product: Product): CartState {
    this.products.push(product);
    return this;
  }

  public remove({ productId }: Product): CartState {
    this.products = this.products.filter((product) => product.productId === productId);
    return this;
  }

  public async pay(payment: Payment): Promise<CartState> {
    console.log(`paying credit card`);
    return new CartStatePaid();
  }

  public async transition({ active }: Transitions): Promise<CartState> {
    return active(this);
  }

  public json(): string {
    return JSON.stringify({
      products: this.products,
    });
  }
}

class CartStatePaid implements CartState {
  public async transition({ paid }: Transitions): Promise<CartState> {
    return paid(this);
  }
  public json(): string {
    return JSON.stringify({
      products: [],
    });
  }
}

class ShoppingCart {
  private cartState: CartState = new CartStateEmpty();

  public async addProduct(product: Product) {
     this.cartState = await this.cartState.transition({
        async active(state) {
          return state.add(product);
        },
        async empty(state) {
          return state.add(product);
        },
        async paid(state) {
          return state;
        }
      });
  }

  public async removeProduct(product: Product) {
    this.cartState = await this.cartState.transition({
      async active(state) {
        return state.remove(product);
      },
      async empty(state) {
        return state;
      },
      async paid(state) {
        return state;
      },
    });
  }

  public pay(payment: Payment): void {
    this.cartState.transition({
      async active(state) {
        return state.pay(payment);
      },
      async empty(state) {
        return state;
      },
      async paid(state) {
        return state;
      }
    })
  }

  public json(): string {
    return this.cartState.json();
  }
}

const product1: Product = {
  productId: 1,
  productName: 'product 1',
  amount: 100,
};

const product2: Product = {
  productId: 2,
  productName: 'product 2',
  amount: 50
};

(async () => {
  const cart = new ShoppingCart();

  await cart.addProduct(product1);
  await cart.addProduct(product2);

  await cart.removeProduct(product1);

  await cart.pay(new CreditCard());

  console.log(cart.json());
})();
