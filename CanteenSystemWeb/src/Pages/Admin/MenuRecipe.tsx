import { useEffect, useState } from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Plus, Edit, Trash2, Search } from "lucide-react";

import type { MenuItem } from "../../types";
import API from "../../API/API";
import {
  createMenu,
  deleteMenu,
  getAllMenu,
  getCategorySpecific,
  getGenericMaster,
} from "../../API/endpoints";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import toast from "react-hot-toast";
import { Modal } from "antd";
import axios from "axios";

interface Category {
  id: number;
  masterTypeId: number;
  name: string;
}

export default function MenuRecipe() {
  const [searchQuery, setSearchQuery] = useState("");

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("finished");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [allCategory, setAllCategory] = useState<Category[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [selectedDropItem, setSelectedDropItem] = useState<string>("");
  const [price, setPrice] = useState<number | "">("");
  const [itemName, setItemName] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [actionType, setActionType] = useState<string>("Add");
  const [ingredients, setIngredients] = useState<
    { materialId: number | null; quantity: number | "" }[]
  >([]);
  const [rawMaterials, setRawMaterials] = useState<any[]>([]);
  const [menuImage, setMenuImage] = useState<File | null>(null);

  useEffect(() => {
    fetchMenuItems();
    fetchAllCategory();
    fetchRawData();
  }, []);

  useEffect(() => {
    console.log("Selected cat:", selectedCategory);
    if (selectedCategory) {
      if (selectedCategory === "trade") {
        fetchCategoryData(6);
      }
    }
  }, [selectedCategory]);
  useEffect(() => {
    if (selectedCategory === "trade" && selectedDropItem) {
      const item = categoryData.find(
        (item) => item.itemName === selectedDropItem,
      );

      if (item) {
        setPrice(item.price);
      }
    }
  }, [selectedCategory, selectedDropItem, categoryData]);

  const fetchMenuItems = async () => {
    try {
      const response = await API.get(getAllMenu);
      if (response.status === 200) {
        setMenuItems(response.data.data);
      }
    } catch (error) {
      console.error("Error Data", error);
    }
  };
  const fetchAllCategory = async () => {
    try {
      const payload = {
        masterTypeId: 4,
      };
      const response = await API.post(getGenericMaster, payload);

      if (response.status === 201) {
        setAllCategory(response.data.result);
      }
    } catch (error) {
      console.error("Error Data", error);
    }
  };
  const fetchCategoryData = async (categoryId: number) => {
    try {
      const payload = {
        category: categoryId,
      };
      const response = await API.post(getCategorySpecific, payload);
      if (response.status === 200) {
        setCategoryData(response.data.data);
      }
    } catch (error) {
      console.error("Error Data", error);
    }
  };
  const fetchRawData = async () => {
    try {
      const payload = {
        category: 1,
      };
      const response = await API.post(getCategorySpecific, payload);
      if (response.status === 200) {
        setRawMaterials(response.data.data);
      }
    } catch (error) {
      console.error("Error Data", error);
    }
  };
  const categories = Array.from(
    new Set(menuItems.map((item) => item.category)),
  );

  const addIngredient = () => {
    setIngredients([...ingredients, { materialId: null, quantity: "" }]);
  };
  const updateIngredient = (
    index: number,
    key: "materialId" | "quantity",
    value: any,
  ) => {
    const updated = [...ingredients];
    updated[index][key] = value;
    setIngredients(updated);
  };
  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };
  // const handleAddMenuItem = async () => {
  //   const payload = {
  //     menuName: selectedCategory === "finished" ? itemName : selectedDropItem,
  //     category: selectedCategory === "finished" ? 2 : 6,
  //     price: price,
  //     ingredients: ingredients.map((ing) => ({
  //       itemId: ing.materialId,
  //       quantity: ing.quantity,
  //     })),
  //   };

  //   try {
  //     const response = await API.post(createMenu, payload);
  //     if (response.status === 200) {
  //       setItemName("");
  //       setPrice("");
  //       setIngredients([]);
  //       setSelectedDropItem("");
  //       setSelectedCategory("finished");
  //       setIsDialogOpen(false);
  //       fetchMenuItems();
  //       toast.success("Menu Item Created");
  //       return;
  //     }
  //   } catch (error) {
  //     console.error("Error Data", error);
  //   }
  //   console.log("Payload:", payload);
  // };

  const handleAddMenuItem = async () => {
    if (!menuImage) {
      toast.error("Please select a menu image");
      return;
    }

    const formData = new FormData();

    formData.append(
      "menuName",
      selectedCategory === "finished" ? itemName : selectedDropItem,
    );
    formData.append(
      "category",
      (selectedCategory === "finished" ? 2 : 6).toString(),
    );
    formData.append("price", price.toString());
    formData.append(
      "ingredients",
      JSON.stringify(
        ingredients.map((ing) => ({
          itemId: ing.materialId,
          quantity: ing.quantity,
        })),
      ),
    );

    // 🔥 IMAGE
    formData.append("image", menuImage);
    console.log("FormData entries:");
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
    try {
      const response = await axios.post(
        "http://172.16.90.26:8014/api/menu/createMenu",
        formData,
      );
      if (response.status === 200) {
        setItemName("");
        setPrice("");
        setIngredients([]);
        setSelectedDropItem("");
        setSelectedCategory("finished");
        setMenuImage(null);
        setIsDialogOpen(false);
        fetchMenuItems();
        toast.success("Menu Item Created");
      }
    } catch (error) {
      console.error("Error Data", error);
      toast.error("Failed to create menu");
    }
  };

  const filteredMenuItems = menuItems
    .filter((item) =>
      activeTab === "ALL" ? true : item.category === activeTab,
    )
    .filter((item) =>
      item.menuName?.toLowerCase().includes(searchQuery.trim().toLowerCase()),
    );

  const handleDelete = (menuId: number) => {
    Modal.confirm({
      title: "Delete Menu",
      content: "Are you sure you want to delete this menu?",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        try {
          const payload = { menuId };

          const response = await API.post(deleteMenu, payload);

          if (response.status === 200) {
            toast.success("Menu deleted successfully!");
            fetchMenuItems();
          }
        } catch (error) {
          console.error("Error deleting menu", error);
          toast.error("Failed to delete menu");
        }
      },
    });
  };
  const handleEditMenu = (item: any) => {
    setActionType("Update");
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Menu & Recipe Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure menu items and ingredient mapping
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>

            <Input
              placeholder="Search by Menu"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
      pl-10
      bg-white
      border border-gray-200
      rounded-lg
      shadow-sm
      text-gray-800
      placeholder:text-gray-400
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500
      focus:border-blue-500
      transition
      duration-200
    "
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button style={{ backgroundColor: "#2563EB", color: "white" }}>
                <Plus className="w-4 h-4 mr-2 text-white" />
                Add Menu Item
              </Button>
            </DialogTrigger>

            <DialogContent className="w-full max-w-[95vw] sm:max-w-2xl px-4 sm:px-6">
              <DialogHeader>
                <DialogTitle>{`${actionType} Menu Item`}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 pt-4">
                {/* Category + Item */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={selectedCategory}
                      onValueChange={(value) => {
                        setSelectedCategory(value);
                        setSelectedDropItem("");
                        setPrice("");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="finished">Finished Goods</SelectItem>
                        <SelectItem value="trade">Trade</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedCategory === "finished" ? (
                    <div className="space-y-2">
                      <Label>Item Name</Label>
                      <Input
                        placeholder="Enter item name"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label>Item</Label>
                      <Select
                        value={selectedDropItem}
                        onValueChange={setSelectedDropItem}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Item" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryData.map((cat) => (
                            <SelectItem key={cat.id} value={cat.itemName}>
                              {cat.itemName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Price + Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price (₹)</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Available</SelectItem>
                        <SelectItem value="0">Unavailable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Menu Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setMenuImage(e.target.files[0]);
                      }
                    }}
                  />
                  {menuImage && (
                    <p className="text-xs text-gray-500">
                      Selected: {menuImage.name}
                    </p>
                  )}
                </div>

                {/* Ingredients */}
                {selectedCategory === "finished" && (
                  <div className="space-y-2">
                    <Label>Ingredients (Bill of Materials)</Label>

                    <div className="border border-gray-200 rounded-lg p-3 sm:p-4 space-y-3">
                      <p className="text-sm text-gray-600">
                        Map raw materials used per unit
                      </p>

                      {/* Scrollable ingredient list */}
                      <div className="max-h-[260px] overflow-y-auto pr-2 space-y-3">
                        {ingredients.map((ingredient, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                          >
                            {/* Raw Material */}
                            <div className="sm:col-span-6">
                              <Select
                                value={ingredient.materialId?.toString()}
                                onValueChange={(value) =>
                                  updateIngredient(
                                    index,
                                    "materialId",
                                    Number(value),
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select raw material" />
                                </SelectTrigger>
                                <SelectContent>
                                  {rawMaterials.map((rm) => (
                                    <SelectItem
                                      key={rm.id}
                                      value={rm.id.toString()}
                                    >
                                      {`${rm.itemName} (${rm.unit})`}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Quantity */}
                            <div className="sm:col-span-4">
                              <Input
                                type="number"
                                placeholder="Qty per unit"
                                value={ingredient.quantity}
                                onChange={(e) =>
                                  updateIngredient(
                                    index,
                                    "quantity",
                                    Number(e.target.value),
                                  )
                                }
                              />
                            </div>

                            {/* Remove */}
                            <div className="sm:col-span-2 flex justify-end">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeIngredient(index)}
                              >
                                ✕
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addIngredient}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Ingredient
                      </Button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="w-full sm:flex-1"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>

                  <Button
                    style={{ backgroundColor: "#2563EB" }}
                    className="w-full sm:flex-1"
                    onClick={handleAddMenuItem}
                  >
                    Save Menu Item
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setActiveTab("ALL")}
          className={`px-4 py-2 text-sm font-medium rounded-lg ${
            activeTab === "ALL"
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          All Items
        </button>

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === category
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredMenuItems.map((item) => (
          <Card key={item.id} className="p-4 h-[280px] flex flex-col">
            <div className="h-32  mb-3 overflow-hidden rounded-lg bg-gray-100">
              <img
                src={`${item.url}`}
                alt={item.menuName}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "/menuAlt.png";
                }}
              />
            </div>
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  {item.menuName}
                </h3>
                <p className="text-xs text-gray-500">{item.category}</p>
              </div>

              <span
                className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  item.amount === 0
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {item.amount === 0 ? "Unavailable" : "Available"}
              </span>
            </div>

            {/* Price */}
            <p className="text-3xl font-semibold text-gray-900 mb-2">
              ₹{item.price}
            </p>

            {/* Ingredients */}
            <div className="border-t border-gray-200 pt-2 flex-1 overflow-hidden">
              <p className="text-xs font-semibold text-gray-700 mb-1">
                Recipe (BOM)
              </p>

              {item.ingredients?.length > 0 ? (
                <div className="space-y-1 max-h-full overflow-y-auto pr-1">
                  {item.ingredients.map((ing, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between px-2 py-1 bg-gray-50 rounded text-xs"
                    >
                      <span className="text-gray-800">{ing.itemName}</span>
                      <span className="text-gray-600 font-medium">
                        {ing.quantity} {ing.unit}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">
                  No ingredients mapped
                </p>
              )}
            </div>

            {/* Actions */}
            {/* <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs"
                onClick={() => handleEditMenu(item)}
              >
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div> */}
          </Card>
        ))}
      </div>
    </div>
  );
}
