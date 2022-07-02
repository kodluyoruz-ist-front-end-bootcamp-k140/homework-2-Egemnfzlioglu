import React, { useEffect, useState } from "react";
import { Button } from "../button";
import { FormItem } from "../form-item";
import Pagination from "./pagination";

export function DataGrid() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [todo, setTodo] = useState(null);

  const [currentPage, setCurrentPage] = useState(); //aynısı
  const [pageSize, setPageSize] = useState(25); //employessPerpage

  const [order, setOrder] = useState("ASC");

  useEffect(() => {
    loadData();
  }, []);

  // ######  pageSize  ######
  const pageLastSize = currentPage * pageSize;
  const PageFirstSize = pageLastSize - pageSize;
  const currentSize = items.slice(PageFirstSize, pageLastSize);
  const totalPagesNum = Math.ceil(items.length / pageSize);
  //data
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

  // ### kendi ekledim ###

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
        {currentSize
          // .sort((a, b) => b.id - a.id)
          .map((item, i, sayi) => {
            return (
              <RenderBaslik key={i} item={item} sayi={sayi}></RenderBaslik>
            );
          })}
      </React.Fragment>
    );
  };

  const renderTable = () => {
    return (
      <>
        <Button className="btn btn-primary btn-xs m-4" onClick={onAdd}>
          Ekle
        </Button>

        <Pagination pages={totalPagesNum} setCurrentPage={setCurrentPage} />

        <table className="table table-striped headTable">
          <thead>
            <tr>
              <th
                onClick={() => sortingID([currentSize, items].id)}
                scope="col"
              >
                #
              </th>
              <th
                onClick={() => sortingTitle([currentSize, items].title)}
                scope="col"
              >
                Başlık
              </th>
              <th
                onClick={() => sortingCompleted([currentSize, items].completed)}
                scope="col"
              >
                Durum
              </th>
              <th scope="col">Aksiyonlar</th>
            </tr>
          </thead>
          <tbody>{renderBody(200)}</tbody>
        </table>
      </>
    );
  };

  //##############################################################################################//
  //######################################## SORTİNG START #######################################//
  //##############################################################################################//

  const sortingID = (col) => {
    if (order === "ASC") {
      const sorted = [...items, currentSize]
        .slice(currentSize, items.length)
        .sort((a, b) => (a.id < b.id ? -1 : 1));

      setOrder("DESC");
      setItems(sorted);
      setPageSize(pageSize );
    } else {
      const sorted = [...items, currentSize]
        .slice(currentSize, items.length)
        .sort((a, b) => (a.id > b.id ? -1 : 1));

      setOrder("ASC");
      setItems(sorted);
      setPageSize(pageSize);
    }
  };

  const sortingTitle = (col) => {
    if (order === "ASC") {
      const sorted = [...items, currentSize]
        .slice(currentSize, items.length)
        .sort((a, b) => (a.title < b.title ? -1 : 1));
      setOrder("DESC");
      setItems(sorted);
      setPageSize(pageSize);
    } else {
      const sorted = [...items, currentSize]
        .slice(currentSize, items.length)
        .sort((a, b) => (a.title > b.title ? -1 : 1));
      setOrder("ASC");
      setItems(sorted);
      setPageSize(pageSize);
    }
  };

  const sortingCompleted = (col) => {
    if (order === "ASC") {
      const sorted = [...items, currentSize]
        .slice(currentSize, items.length)
        .sort((a, b) => (a.completed < b.completed ? -1 : 1));
      setOrder("DESC");
      setItems(sorted);
      setPageSize(pageSize);
    } else {
      const sorted = [...items, currentSize]
        .slice(currentSize, items.length)
        .sort((a, b) => (a.completed > b.completed ? -1 : 1));
      setOrder("ASC");
      setItems(sorted);
      setPageSize(pageSize);
    }
  };

  //##############################################################################################//
  //######################################## SORTİNG END ########################################//
  //##############################################################################################//

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
