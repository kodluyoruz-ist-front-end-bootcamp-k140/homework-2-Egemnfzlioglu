import React, { useEffect, useState } from "react";
import { Button } from "../button";
import { FormItem } from "../form-item";

export function DataGrid() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [todo, setTodo] = useState(null);

  const [sayi, setSayi] = useState(0);
  const [order, setOrder] = useState("ASC");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((x) => x.json())
      .then((response) => {
        setItems(response);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  // ###

  function RenderBaslik(props) {
    return (
      <tr>
        <th scope="row">{props.item.id}</th>
        <td>{props.item.title}</td>
        <td>{props.item.completed ? "Tamamlandı" : "Yapılacak"}</td>
        <td>
          <Button
            className="btn btn-xs btn-danger"
            onClick={() => onRemove(props.item.id)}
          >
            Sil
          </Button>
          <Button
            className="btn btn-xs btn-warning"
            onClick={() => onEdit(props.item)}
          >
            Düzenle
          </Button>
        </td>
      </tr>
    );
  }

  const renderBody = (e) => {
    return (
      <React.Fragment>
        {items
          // .sort((a, b) => b.id - a.id)
          .map((item, i) => {
            return <RenderBaslik key={i} item={item}></RenderBaslik>;
          })
          // istediğin kadar ekrana "item" getirebilirsin
          .splice(0, e === 0 ? 200 : e)}
      </React.Fragment>
    );
  };

  const renderTable = () => {
    let HOPP = " HOOOPP !!! Hemşehrim Nereye gidiyorsun?";
    return (
      <>
        <div>
          <ul>
            <br />
            <li>
              {" "}
              Başlıkların Üstüne Tıklayarak Ürünleri Ters Döndürebilirsiniz.
            </li>
            <li>
              {" "}
              İstediğiniz Miktarda Ürünü{" "}
              <strong>"Listelenmeni İstediğiniz Miktar"</strong> Kısmında
              Görebilirsiniz.
            </li>
            <li>Eksi Değer ve Harf Giremezsiniz.</li>
          </ul>
        </div>
        <Button className="btn btn-primary btn-xs m-4" onClick={onAdd}>Ekle</Button>

        {/* splice metodunun inputu */}
        <label className="mx-5 text-success ">
          Listelenmesini İstediğin Miktar :
          <input
            type="number"
            className="m-2"
            onChange={(e) => {
              setSayi(Number(e.target.value));
            }}
            value={sayi < 0 || sayi > 250 ? <h1>{alert(HOPP)}</h1> : sayi}
          />
        </label>

        <table className="table">
          <thead className="headTable">
            <tr>
              <th onClick={() => sorting(items.id)} scope="col">
                #
              </th>
              <th onClick={() => sorting(items.title)} scope="col">
                Başlık
              </th>
              <th onClick={() => sorting(items.completed)} scope="col">
                Durum
              </th>
              <th scope="col">Aksiyonlar</th>
            </tr>
          </thead>
          <tbody>{renderBody(sayi)}</tbody>
        </table>
      </>
    );
  };

  /* Sorting Function */
  const sorting = (col) => {
    if (order === "ASC") {
      const sorted = [...items].sort((a, b) => (a[col] > b[col] ? 1 : -1));
      setOrder("DESC");
      setItems(sorted);
    } else {
      const sorted = [...items].sort((a, b) => (a[col] > b[col] ? -1 : 1));
      setOrder("ASC");
      setItems(sorted);
    }
  };

  const saveChanges = () => {
    // insert
    if (todo && todo.id === -1) {
      todo.id = Math.max(...items.map((item) => item.id)) + 1;
      setItems((items) => {
        items.push(todo);
        return [...items];
      });

      alert("Ekleme işlemi başarıyla gerçekleşti.");
      setTodo(null);
      return;
    }
    // update
    const index = items.findIndex((item) => item.id === todo.id);
    setItems((items) => {
      items[index] = todo;
      return [...items];
    });
    setTodo(null);
  };

  const onAdd = () => {
    setTodo({
      id: -1,
      title: "",
      completed: false,
    });
  };

  const onRemove = (id) => {
    const status = window.confirm("Silmek istediğinize emin misiniz?");

    if (!status) {
      return;
    }
    const index = items.findIndex((item) => item.id === id);

    setItems((items) => {
      items.splice(index, 1);
      return [...items];
    });
  };

  const onEdit = (todo) => {
    setTodo(todo);
  };

  const cancel = () => {
    setTodo(null);
  };

  const renderEditForm = () => {
    return (
      <>
        <FormItem
          title="Title"
          value={todo.title}
          onChange={(e) =>
            setTodo((todos) => {
              return { ...todos, title: e.target.value };
            })
          }
        />
        <FormItem
          component="checkbox"
          title="Completed"
          value={todo.completed}
          onChange={(e) =>
            setTodo((todos) => {
              return { ...todos, completed: e.target.checked };
            })
          }
        />
        <Button onClick={saveChanges}>Kaydet</Button>
        <Button className="btn btn-default" onClick={cancel}>
          Vazgeç
        </Button>
      </>
    );
  };

  return (
    <>{loading ? "Yükleniyor...." : todo ? renderEditForm() : renderTable()}</>
  );
}
