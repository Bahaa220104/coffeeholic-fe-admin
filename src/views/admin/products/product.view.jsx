import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Heading,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import Page from "../../../components/admin/page.component";
import BasicMultiSelect from "../../../components/admin/select.component";
import useApi from "../../../utilities/hooks/useApi";
import useItem from "../../../utilities/hooks/useItem";
import DatatablePage from "../../../components/admin/datatable-page.component";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DataTable from "../../../components/admin/datatable.component";
import { useEffect, useRef, useState } from "react";
import { PlusIcon } from "lucide-react";
import axios from "axios";

export default function Product() {
  const params = useParams();
  const controller = useItem({
    url: "/products",
    empty: { name: "", types: [], categories: [], description: "", price: 0 },
    name: "Products",
  });

  const categoriesApi = useApi({ url: "/categories", callOnMount: true });
  const productsApi = useApi({
    url: "/products",
    params: { type: "addon" },
    callOnMount: true,
  });

  const options = {
    categories:
      categoriesApi.data?.map((c) => {
        return { value: c.id, label: c.name };
      }) || [],
    type: [
      { value: "addon", label: "Addon" },
      { value: "product", label: "Product" },
    ],
    addons:
      productsApi.data
        ?.map((c) => {
          return { value: c.id, label: c.name };
        })
        .filter((v) => v.value != controller.item?.id) || [],
  };

  return (
    <Page
      title={controller.pageTitle}
      includeRemove={
        controller.mode === "create" ? null : controller.handleRemove
      }
    >
      <Box>
        <form
          style={{ width: "100%" }}
          onSubmit={(e) => {
            e.preventDefault();
            controller.handleSubmit();
          }}
        >
          <VStack spacing={3}>
            {" "}
            <ProductImage
              image={controller.get("image")}
              handleChange={controller.handleChange}
            />
            <InputGroup>
              <InputLeftAddon>Name</InputLeftAddon>
              <Input
                required
                type="text"
                value={controller.get("name")}
                onChange={(e) => {
                  controller.handleChange("name", e.target.value);
                }}
              />
            </InputGroup>
            <InputGroup>
              <InputLeftAddon>Price</InputLeftAddon>
              <Input
                required
                type="number"
                value={controller.get("price")}
                onChange={(e) => {
                  controller.handleChange("price", Number(e.target.value));
                }}
              />
            </InputGroup>
            <InputGroup w="100%">
              <InputLeftAddon>Type</InputLeftAddon>
              <BasicMultiSelect
                options={options.type}
                controller={controller}
                field={"types"}
              />
            </InputGroup>
            <InputGroup w="100%">
              <InputLeftAddon>Category</InputLeftAddon>
              <BasicMultiSelect
                options={options.categories}
                controller={controller}
                field={"categories"}
              />
            </InputGroup>
            <InputGroup w="100%">
              <InputLeftAddon>Addon</InputLeftAddon>
              <BasicMultiSelect
                options={options.addons}
                controller={controller}
                field={"addons"}
              />
            </InputGroup>
            <Textarea
              placeholder="Description"
              value={controller.get("description")}
              onChange={(e) => {
                controller.handleChange("description", e.target.value);
              }}
              required
            />
            <HStack w="100%" spacing={3} justifyContent={"end"}>
              {controller.mode == "edit" && (
                <Button
                  type="submit"
                  variant="ghost"
                  onClick={controller.reset}
                  disabled={!controller.dirty}
                >
                  Reset changes
                </Button>
              )}
              <Button type="submit" disabled={!controller.dirty}>
                Save changes
              </Button>
            </HStack>
          </VStack>
        </form>
        {controller.mode === "edit" && (
          <Variants productId={params.id} product={controller.item} />
        )}
      </Box>
    </Page>
  );
}

function Variants({ product, productId }) {
  const variantsApi = useApi({
    url: "/variants",
    params: { productId },
    callOnMount: true,
  });

  const variantGroupsApi = useApi({
    url: "/variantGroups",
    params: { productId },
    callOnMount: true,
  });

  async function handleRemoveVariant(variant) {
    const response = await variantsApi.call({
      method: "delete",
      url: "/variants/" + variant.id,
    });
    if (response.ok) {
      await variantsApi.call();
      await variantGroupsApi.call();
    }
  }

  async function handleRemoveVariantGroup(variantGroup) {
    const response = await variantGroupsApi.call({
      method: "delete",
      url: "/variantGroups/" + variantGroup.id,
    });
    if (response.ok) {
      await variantGroupsApi.call();
      await variantsApi.call();
    }
  }

  return (
    <Box mt={8}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Heading
          sx={{
            fontWeight: 500,
            fontSize: "1.2rem",
            height: "100%",
            mb: 4,
          }}
        >
          Variants for "{product.name}"
        </Heading>
        <HStack>
          <VariantGroupDialog
            productId={productId}
            mode={"create"}
            refresh={variantGroupsApi.call}
          />
        </HStack>
      </Box>
      <DataTable
        columns={[
          {
            key: "id",
            label: "ID",
          },
          {
            key: "name",
            label: "Name",
          },
          {
            key: "price",
            label: "Price",
            sx: { width: "100%" },
          },
          {
            key: "actions",
            label: "",
            showForGroups: true,
            render: (row) => {
              return (
                <HStack justifyContent={"end"}>
                  {row.group ? (
                    <VariantDialog
                      productId={productId}
                      variantGroupId={row.id}
                      mode="create"
                      refresh={variantsApi.call}
                    />
                  ) : null}
                  {row.group ? (
                    <VariantGroupDialog
                      productId={productId}
                      mode="edit"
                      initial={row}
                      refresh={variantGroupsApi.call}
                    />
                  ) : (
                    <VariantDialog
                      variantGroupId={row.id}
                      productId={productId}
                      mode="edit"
                      initial={row}
                      refresh={variantsApi.call}
                    />
                  )}
                  <Button
                    colorScheme="red"
                    size="xs"
                    onClick={() => {
                      console.log("DELETE ROW: ", row);

                      if (row.group) {
                        handleRemoveVariantGroup(row);
                      } else {
                        handleRemoveVariant(row);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </HStack>
              );
            },
          },
        ]}
        rows={variantsApi.data || []}
        groupBy={{
          label: "name",
          key: "variantGroupId",
          groups: variantGroupsApi.data || [],
        }}
      />
    </Box>
  );
}

function VariantGroupDialog({ productId, mode, initial, refresh }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const api = useApi({ method: "post", url: "/variantGroups" });

  const [item, setItem] = useState({
    name: "",
    productId: Number(productId),
  });

  const [updated, setUpdated] = useState({});

  useEffect(() => {
    if (mode === "create" && isOpen) {
      setUpdated({});
      setItem({
        name: "",
        productId: Number(productId),
      });
    } else {
      if (initial) {
        setItem({
          ...initial,
          productId: Number(productId),
        });
        setUpdated({});
      }
    }
  }, [initial, mode, isOpen]);

  async function handleSubmit() {
    if (mode === "create") {
      console.log("CREATE!");
      const response = await api.call({
        method: "post",
        data: { ...item, ...updated },
      });
      if (response.ok) {
        await refresh();
        onClose();
      }
    } else {
      const response = await api.call({
        method: "put",
        url: "/variantGroups/" + item.id,
        data: updated,
      });
      if (response.ok) {
        await refresh();
        onClose();
      }
    }
  }

  return (
    <>
      <Button
        size={"xs"}
        onClick={onOpen}
        colorScheme={mode === "edit" ? "yellow" : "brand"}
      >
        {mode === "edit" ? "Edit" : "Add New Variant Group"}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <ModalHeader>
              {mode === "edit" ? "Edit Variant Group" : "Add New Variant Group"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <InputGroup>
                <InputLeftAddon>Name</InputLeftAddon>
                <Input
                  required
                  type="text"
                  value={updated.name ?? item.name}
                  onChange={(e) =>
                    setUpdated((curr) => ({ ...curr, name: e.target.value }))
                  }
                />
              </InputGroup>
            </ModalBody>

            <ModalFooter>
              <Button mr={3} variant="ghost" onClick={onClose}>
                Close
              </Button>
              <Button onClick={onClose} type="submit">
                Submit
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}

function VariantDialog({ productId, variantGroupId, mode, initial, refresh }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const api = useApi({ method: "post", url: "/variants" });

  const [item, setItem] = useState({
    name: "",
    variantGroupId: Number(variantGroupId),
    productId: Number(productId),
  });

  const [updated, setUpdated] = useState({});

  useEffect(() => {
    if (mode === "create" && isOpen) {
      setUpdated({});
      setItem({
        name: "",
        price: 0,
        variantGroupId: Number(variantGroupId),
        productId: Number(productId),
      });
    } else {
      if (initial) {
        setItem({
          ...initial,
          variantGroupId: Number(variantGroupId),
          productId: Number(productId),
        });
        setUpdated({});
      }
    }
  }, [initial, mode, isOpen]);

  async function handleSubmit() {
    if (mode === "create") {
      const response = await api.call({
        method: "post",
        data: { ...item, ...updated },
      });
      if (response.ok) {
        await refresh();
        onClose();
      }
    } else {
      const response = await api.call({
        method: "put",
        url: "/variants/" + item.id,
        data: updated,
      });
      if (response.ok) {
        await refresh();
        onClose();
      }
    }
  }

  return (
    <>
      <Button
        size="xs"
        onClick={onOpen}
        colorScheme={mode === "edit" ? "yellow" : "brand"}
      >
        {mode === "edit" ? "Edit" : "Add New Variant"}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <ModalHeader>
              {mode === "edit" ? "Edit Variant" : "Add New Variant"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <InputGroup>
                <InputLeftAddon>Name</InputLeftAddon>
                <Input
                  required
                  type="text"
                  value={updated.name ?? item.name}
                  onChange={(e) =>
                    setUpdated((curr) => ({ ...curr, name: e.target.value }))
                  }
                />
              </InputGroup>
              <InputGroup mt={3}>
                <InputLeftAddon>Price</InputLeftAddon>
                <Input
                  required
                  type="number"
                  value={updated.price ?? item.price}
                  onChange={(e) =>
                    setUpdated((curr) => ({
                      ...curr,
                      price: Number(e.target.value),
                    }))
                  }
                />
                <InputRightAddon>LBP</InputRightAddon>
              </InputGroup>
            </ModalBody>

            <ModalFooter>
              <Button mr={3} variant="ghost" onClick={onClose}>
                Close
              </Button>
              <Button type="submit">Submit</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}

function ProductImage({ image, handleChange }) {
  //"https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190617_CaffeAmericano.jpg?impolicy=1by1_wide_topcrop_630"

  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);

      try {
        const response = await axios.post(
          "http://localhost:3000/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            },
          }
        );
        setUploadProgress(0);

        const { imageUrl } = response.data;
        handleChange("image", imageUrl);
      } catch (error) {}
    }
  };

  if (!image) {
    return (
      <Box position={"relative"}>
        <Button
          variant="ghost"
          borderStyle={"dashed"}
          colorScheme="green"
          w="100%"
          display="flex"
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          borderWidth={"2px"}
          color={"gray.300"}
          _hover={{
            borderColor: "gray.400",
            color: "gray.500",
          }}
          sx={{
            cursor: "pointer",
            aspectRatio: 1,
            maxWidth: "300px",
            height: "300px",
          }}
          onClick={handleButtonClick}
        >
          {uploadProgress > 0 ? (
            <CircularProgress value={uploadProgress} />
          ) : (
            <>
              <PlusIcon size="32px" />
              Upload image
            </>
          )}
        </Button>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </Box>
    );
  }

  return (
    <>
      <Image
        sx={{
          width: "100%",
          maxWidth: "300px",
          aspectRatio: 1,
          borderRadius: "10px",
          objectFit: "cover",
        }}
        src={image}
      />
      <Button
        size="xs"
        onClick={() => {
          handleChange("image", false);
        }}
        colorScheme="yellow"
      >
        Replace
      </Button>
    </>
  );
}

/*import {
  Box,
  Button,
  Card,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import Page from "../../../components/admin/page.component";

import { Select } from "chakra-react-select";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ExpandIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import EnlargeImage from "../../../components/admin/enlarge-image.component";
import useData from "../../../utilities/hooks/useData";
import { useEffect, useRef } from "react";
import DataTable from "../../../components/admin/datatable.component";

export default function Product() {
  const { options } = useData({
    sources: {
      options: [
        { key: "categories", url: "https://dummyjson.com/posts/tags" },
        { key: "type", url: "https://dummyjson.com/posts/tags" },
      ],
    },
  });

  return (
    <Page
      title={[
        { label: "Products", to: "/products" },
        { label: "Armadillo", to: "/products/1" },
      ]}
    >
      <VStack spacing={3}>
        <form
          style={{ width: "100%" }}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <VStack spacing={3}>
            <HStack spacing={3} w="100%">
              <InputGroup>
                <InputLeftAddon>Name</InputLeftAddon>
                <Input type="text" />
              </InputGroup>
              <InputGroup w="100%">
                <InputLeftAddon>Type</InputLeftAddon>
                <Select
                  options={
                    options?.type?.map((option) => {
                      return { label: option.name, value: option.slug };
                    }) || []
                  }
                  colorScheme="green"
                  chakraStyles={{
                    container: (provided) => ({
                      ...provided,
                      width: "100%", // Make the container 100% width
                    }),
                    control: (provided) => ({
                      ...provided,
                      width: "100%", // Make the control 100% width
                    }),
                  }}
                  isMulti
                  menuPortalTarget={document.body}
                />
              </InputGroup>
            </HStack>
            <InputGroup w="100%">
              <InputLeftAddon>Category</InputLeftAddon>
              <Select
                options={
                  options?.categories?.map((option) => {
                    return { label: option.name, value: option.slug };
                  }) || []
                }
                colorScheme="green"
                chakraStyles={{
                  container: (provided) => ({
                    ...provided,
                    width: "100%", // Make the container 100% width
                  }),
                  control: (provided) => ({
                    ...provided,
                    width: "100%", // Make the control 100% width
                  }),
                }}
                isMulti
                menuPortalTarget={document.body}
              />
            </InputGroup>

            <Textarea placeholder="Description" />
            <HStack w="100%" spacing={3} justifyContent={"end"}>
              <Button type="submit" variant="ghost">
                Reset changes
              </Button>
              <Button type="submit">Save changes</Button>
            </HStack>
            <Images />
          </VStack>
        </form>
        <Tabs w="100%">
          <TabList>
            <Tab>Variants</Tab>
            <Tab>Addons</Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={0} pt={4}>
              <Variants />
            </TabPanel>
            <TabPanel p={0} pt={4}>
              <Addons />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Page>
  );
}

function Images() {
  const { value, handleChangeValue, open, handleChangeOpen } = useData({
    initialValue: [
      {
        id: 1,
        url: "https://bit.ly/dan-abramov",
        sequenceNumber: 1,
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1436491911682-72ab1d398f59?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29mZmVlJTIwY3VwfGVufDB8fDB8fHww",
        sequenceNumber: 2,
      },
      {
        id: 3,
        url: "https://plus.unsplash.com/premium_photo-1674327105280-b86494dfc690?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29mZmVlJTIwY3VwfGVufDB8fDB8fHww",
        sequenceNumber: 3,
      },
    ],
    sortBySequenceNumber: true,
  });

  const fileInputRef = useRef(null);

  function moveRight(image, index) {
    const oldSequenceNumber = image.sequenceNumber;
    handleChangeValue(index, "sequenceNumber", value[index + 1].sequenceNumber);
    handleChangeValue(index + 1, "sequenceNumber", oldSequenceNumber);
  }

  function moveLeft(image, index) {
    const oldSequenceNumber = image.sequenceNumber;
    handleChangeValue(index, "sequenceNumber", value[index - 1].sequenceNumber);
    handleChangeValue(index - 1, "sequenceNumber", oldSequenceNumber);
  }

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 2,
        w: "100%",
      }}
    >
      {value.map((image, index) => (
        <Card
          key={image.id}
          overflow={"hidden"}
          variant="outline"
          position={"relative"}
        >
          <HStack
            spacing={1}
            sx={{ position: "absolute", top: 0, right: 0, p: 1, w: "100%" }}
            justifyContent={"space-between"}
          >
            <IconButton
              colorScheme="gray"
              size="xs"
              shadow={"md"}
              onClick={() => {
                handleChangeOpen("enlargeImage", image);
              }}
            >
              <ExpandIcon size="16px" />
            </IconButton>
            <IconButton colorScheme="red" size="xs" shadow={"md"}>
              <Trash2Icon size="16px" />
            </IconButton>
          </HStack>
          <Image src={image.url} h="200px" />
          <HStack justifyContent={"space-between"} p={2} spacing={2}>
            {index !== 0 ? (
              <Button
                leftIcon={
                  <ChevronLeftIcon size="16px" style={{ margin: "-4px" }} />
                }
                size="xs"
                colorScheme="gray"
                onClick={() => {
                  moveLeft(image, index);
                }}
              >
                Move left
              </Button>
            ) : (
              <div></div>
            )}
            {index !== value.length - 1 && (
              <Button
                rightIcon={
                  <ChevronRightIcon size="16px" style={{ margin: "-4px" }} />
                }
                size="xs"
                colorScheme="gray"
                onClick={() => {
                  moveRight(image, index);
                }}
              >
                Move right
              </Button>
            )}
          </HStack>
        </Card>
      ))}
      <Button
        variant="ghost"
        borderStyle={"dashed"}
        colorScheme="green"
        h="240px"
        w="240px"
        display="flex"
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        borderWidth={"2px"}
        color={"gray.300"}
        _hover={{
          borderColor: "gray.400",
          color: "gray.500",
        }}
        sx={{
          cursor: "pointer",
        }}
        onClick={handleButtonClick}
      >
        <PlusIcon size="32px" />
        Upload image
      </Button>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <EnlargeImage open={open} handleChangeOpen={handleChangeOpen} />
    </Box>
  );
}

function Variants() {
  const variants = useData({
    initialValue: [
      {
        id: 1,
        name: "Small",
        variantGroupId: 1,
        sequenceNumber: 1,
      },
      {
        id: 2,
        name: "Medium",
        variantGroupId: 1,
        sequenceNumber: 2,
      },
      {
        id: 3,
        name: "Large",
        variantGroupId: 1,
        sequenceNumber: 3,
      },
      {
        id: 4,
        name: "Red",
        variantGroupId: 2,
        sequenceNumber: 1,
      },
      {
        id: 5,
        name: "Green",
        variantGroupId: 2,
        sequenceNumber: 2,
      },
    ],
    sortBySequenceNumber: true,
  });

  const variantGroups = useData({
    initialValue: [
      {
        id: 1,
        name: "Size",
        sequenceNumber: 1,
      },
      { id: 2, name: "Color", sequenceNumber: 2 },
    ],
    sortBySequenceNumber: true,
  });

  function moveVariant(row, index, nextValueIndex) {
    return () => {
      const oldSequenceNumber = row.sequenceNumber;
      variants.handleChangeValue(
        index,
        "sequenceNumber",
        variants.value[nextValueIndex].sequenceNumber
      );
      variants.handleChangeValue(
        nextValueIndex,
        "sequenceNumber",
        oldSequenceNumber
      );
    };
  }

  function moveVariantGroup(row, index, nextValueIndex) {
    return () => {
      const oldSequenceNumber = row.sequenceNumber;
      variantGroups.handleChangeValue(
        index,
        "sequenceNumber",
        variantGroups.value[nextValueIndex].sequenceNumber
      );
      variantGroups.handleChangeValue(
        nextValueIndex,
        "sequenceNumber",
        oldSequenceNumber
      );
    };
  }



  return (
    <DataTable
      buttons={[
        {
          label: "Add variant group",
          props: {
            onClick: () => {},
            size: "sm",
            sx: { mt: -4, px: 4 },
          },
        },
      ]}
      columns={[
        { key: "id", label: "ID" },
        { key: "name", label: "Name", sx: { width: "100%" } },
        {
          key: "actions",
          label: "",
          showForGroups: true,
          render: (row) => {
            return (
              <HStack justifyContent={"end"}>
                {row.group ? <Button size="xs">Add variant</Button> : null}
                <Button colorScheme="yellow" size="xs">
                  Edit
                </Button>
                <Button colorScheme="red" size="xs">
                  Delete
                </Button>
              </HStack>
            );
          },
        },
        {
          key: "movements",
          label: "",
          showForGroups: true,
          render: (row) => {
            let show = { down: true, up: true };

            let onClickUp;
            let onClickDown;

            if (row.group) {
              const groups = variantGroups.value;

              const index = groups.findIndex((e) => e.id == row.id);
              if (index == groups.length - 1) {
                show.down = false;
              } else if (index == 0) {
                show.up = false;
              }

              if (show.up) {
                onClickUp = moveVariantGroup(groups[index], index, index - 1);
              }
              if (show.down) {
                onClickDown = moveVariantGroup(groups[index], index, index + 1);
              }
            } else {
              const groupElements = [];
              variants.value.forEach((e, index) => {
                if (e.variantGroupId === row.variantGroupId) {
                  groupElements.push({ ...e, index });
                }
              });

              const index = groupElements.findIndex((e) => e.id == row.id);
              if (index == groupElements.length - 1) {
                show.down = false;
              } else if (index == 0) {
                show.up = false;
              }

              const valueIndex = groupElements[index].index;

              if (show.up) {
                const nextValueIndex = groupElements.find(
                  (e) => e.id == groupElements[index - 1].id
                ).index;
                onClickUp = moveVariant(row, valueIndex, nextValueIndex);
              }

              if (show.down) {
                const prevValueIndex = groupElements.find(
                  (e) => e.id == groupElements[index + 1].id
                ).index;
                onClickDown = moveVariant(row, valueIndex, prevValueIndex);
              }
            }

            return (
              <HStack justifyContent={"end"}>
                {show.up ? (
                  <IconButton onClick={onClickUp} colorScheme="gray" size="xs">
                    <ChevronUpIcon size="16px" strokeWidth="2.5px" />
                  </IconButton>
                ) : null}
                {show.down ? (
                  <IconButton
                    onClick={onClickDown}
                    colorScheme="gray"
                    size="xs"
                  >
                    <ChevronDownIcon size="16px" strokeWidth="2.5px" />
                  </IconButton>
                ) : null}
              </HStack>
            );
          },
        },
      ]}
      rows={variants.value}
      groupBy={{
        sortable: true,
        label: "name",
        key: "variantGroupId",
        groups: variantGroups.value,
      }}
    />
  );
}

function Addons() {
  const addons = useData({
    initialValue: [
      { id: 1, name: "Sugar" },
      { id: 2, name: "Salt" },
    ],
    sortBySequenceNumber: true,
  });
  return (
    <DataTable
      columns={[
        { key: "id", label: "ID" },
        { key: "name", label: "Name", sx: { width: "100%" } },
        {
          key: "actions",
          label: "",
          showForGroups: true,
          render: (row) => {
            return (
              <HStack justifyContent={"end"}>
                <IconButton colorScheme="gray" size="xs">
                  <ChevronUpIcon size="16px" strokeWidth="2.5px" />
                </IconButton>

                <IconButton colorScheme="gray" size="xs">
                  <ChevronDownIcon size="16px" strokeWidth="2.5px" />
                </IconButton>
              </HStack>
            );
          },
        },
      ]}
      rows={addons.value}
    />
  );
}*/
