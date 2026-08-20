export type AdminAttributeValue = {
  id: string;
  title: string;
  colorHex: string | null;
  imageUrl: string | null;
};

export type AdminAttributeListItem = {
  id: string;
  title: string;
  key: string;
  values: AdminAttributeValue[];
};
