import {
  Card,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";

export default function EnlargeImage({ open, handleChangeOpen }) {
  return (
    <Modal
      onClose={() => {
        handleChangeOpen("enlargeImage", false);
      }}
      isOpen={open.enlargeImage}
      isCentered
      size="xl"
    >
      <ModalOverlay />
      <ModalContent sx={{ p: 0 }}>
        <ModalBody sx={{ p: 0 }}>
          <Card overflow={"hidden"}>
            <Image w="100%" objectFit="contain" src={open.enlargeImage?.url} />
          </Card>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
