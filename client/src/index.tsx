import React, { Component, useImperativeHandle } from "react";
import { HashRouter } from "react-router-dom";

import ReactDOM from "react-dom";
import { hot } from "react-hot-loader/root";
import { App } from "./components/App/App";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";

// Global styles
import "./components/reset.scss";
import "./components/page/page.scss";
import "./components/link/link.scss";

const rootEl = document.getElementById("root");

ReactDOM.render(
  <ErrorBoundary>
    <HashRouter>
      <App />
    </HashRouter>
  </ErrorBoundary>,
  rootEl
);

export default hot(App);

/*
//Thinking in React

const jsonApiResponse_PRODUCTS = [
  {
    category: "Sporting Goods",
    price: "$49.99",
    stocked: true,
    name: "Football",
  },
  {
    category: "Sporting Goods",
    price: "$9.99",
    stocked: true,
    name: "Baseball",
  },
  {
    category: "Sporting Goods",
    price: "$29.99",
    stocked: false,
    name: "Basketball",
  },
  {
    category: "Electronics",
    price: "$99.99",
    stocked: true,
    name: "iPod Touch",
  },
  {
    category: "Electronics",
    price: "$399.99",
    stocked: false,
    name: "iPhone 5",
  },
  { category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7" },
];

interface ProductCategoryRowProps {
  category: string;
}
interface ProductCategoryRowState {}
class ProductCategoryRow extends Component<
  ProductCategoryRowProps,
  ProductCategoryRowState
> {
  render() {
    const category = this.props.category;
    return (
      <tr>
        <th colSpan={2}>{category}</th>
      </tr>
    );
  }
}

interface ProductRowProps {
  product: {
    name: string;
    stocked: boolean;
    price: string;
    category: string;
  };
}
interface ProductRowState {}

class ProductRow extends Component<ProductRowProps, ProductRowState> {
  render() {
    const product = this.props.product;
    const name = product.stocked ? (
      product.name
    ) : (
      <span style={{ color: "red" }}>{product.name}</span>
    );

    return (
      <tr>
        <td>{name}</td>
        <td>{product.price}</td>
      </tr>
    );
  }
}

interface ProductTableProps {
  products: ProductRowProps["product"][];
  inStockOnly: boolean;
  filterText: string;
}
interface ProductTableState {}
class ProductTable extends React.Component<
  ProductTableProps,
  ProductTableState
> {
  render() {
    const filterText = this.props.filterText;
    const inStockOnly = this.props.inStockOnly;

    const rows: unknown[] = [];
    let lastCategory = null as any;

    this.props.products.forEach((product) => {
      if (product.name.indexOf(filterText) === -1) {
        return;
      }
      if (inStockOnly && !product.stocked) {
        return;
      }
      if (product.category !== lastCategory) {
        rows.push(
          <ProductCategoryRow
            category={product.category}
            key={product.category}
          />
        );
      }
      rows.push(<ProductRow product={product} key={product.name} />);
      lastCategory = product.category;
    });

    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

interface SearchBarProps {
  filterText: string;
  inStockOnly: boolean;
  onFilterTextChange: any;
  onInStockChange: any;
}
interface SearchBarState {}
class SearchBar extends Component<SearchBarProps, SearchBarState> {
  constructor(props: SearchBarProps) {
    super(props);

    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.handleInStockChange = this.handleInStockChange.bind(this);
  }

  handleFilterTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.props.onFilterTextChange(e.target.value);
  }

  handleInStockChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.props.onInStockChange(e.target.checked);
  }

  render() {
    return (
      <form>
        <input
          type="text"
          placeholder="Search..."
          value={this.props.filterText}
          onChange={this.handleFilterTextChange}
        />
        <p>
          <input
            type="checkbox"
            checked={this.props.inStockOnly}
            onChange={this.handleInStockChange}
          />{" "}
          Only show products in stock
        </p>
      </form>
    );
  }
}

interface FilterableProductTableProps {
  products: ProductRowProps["product"][];
}
interface FilterableProductTableState {
  filterText: string;
  inStockOnly: boolean;
}
class FilterableProductTable extends Component<
  FilterableProductTableProps,
  FilterableProductTableState
> {
  constructor(props: FilterableProductTableProps) {
    super(props);
    this.state = {
      filterText: "",
      inStockOnly: false,
    };

    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.handleInStockChange = this.handleInStockChange.bind(this);
  }

  handleFilterTextChange(filterText: string) {
    this.setState({
      filterText: filterText,
    });
  }

  handleInStockChange(inStockOnly: boolean) {
    this.setState({
      inStockOnly: inStockOnly,
    });
  }

  render() {
    return (
      <div>
        <SearchBar
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
          onFilterTextChange={this.handleFilterTextChange}
          onInStockChange={this.handleInStockChange}
        />
        <ProductTable
          products={this.props.products}
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <FilterableProductTable products={jsonApiResponse_PRODUCTS} />,
  rootEl
);
*/
