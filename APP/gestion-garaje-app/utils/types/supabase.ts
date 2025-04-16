export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export type Database = {
    graphql_public: {
        Tables: {
            [_ in never]: never;
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            graphql: {
                Args: {
                    operationName?: string;
                    query?: string;
                    variables?: Json;
                    extensions?: Json;
                };
                Returns: Json;
            };
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
    public: {
        Tables: {
            clientes: {
                Row: {
                    apellidos: string | null;
                    codigo_postal: string;
                    direccion: string;
                    dni: string;
                    email: string | null;
                    fecha_entrada: string;
                    fecha_salida: string | null;
                    id: number;
                    nombre: string;
                    numero_cuenta_iban: string;
                    observaciones: string | null;
                    poblacion: string;
                    provincia: string;
                    telefono: string;
                };
                Insert: {
                    apellidos?: string | null;
                    codigo_postal?: string;
                    direccion: string;
                    dni: string;
                    email?: string | null;
                    fecha_entrada: string;
                    fecha_salida?: string | null;
                    id?: number;
                    nombre: string;
                    numero_cuenta_iban: string;
                    observaciones?: string | null;
                    poblacion?: string;
                    provincia?: string;
                    telefono: string;
                };
                Update: {
                    apellidos?: string | null;
                    codigo_postal?: string;
                    direccion?: string;
                    dni?: string;
                    email?: string | null;
                    fecha_entrada?: string;
                    fecha_salida?: string | null;
                    id?: number;
                    nombre?: string;
                    numero_cuenta_iban?: string;
                    observaciones?: string | null;
                    poblacion?: string;
                    provincia?: string;
                    telefono?: string;
                };
                Relationships: [];
            };
            coches: {
                Row: {
                    año: number | null;
                    cliente_id: number;
                    color: string | null;
                    id: number;
                    marca: string;
                    matricula: string;
                    modelo: string;
                    numero_plaza: number | null;
                    tipo: Database["public"]["Enums"]["car_type"] | null;
                };
                Insert: {
                    año?: number | null;
                    cliente_id: number;
                    color?: string | null;
                    id?: number;
                    marca: string;
                    matricula: string;
                    modelo: string;
                    numero_plaza?: number | null;
                    tipo?: Database["public"]["Enums"]["car_type"] | null;
                };
                Update: {
                    año?: number | null;
                    cliente_id?: number;
                    color?: string | null;
                    id?: number;
                    marca?: string;
                    matricula?: string;
                    modelo?: string;
                    numero_plaza?: number | null;
                    tipo?: Database["public"]["Enums"]["car_type"] | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "coches_cliente_id_fkey";
                        columns: ["cliente_id"];
                        isOneToOne: false;
                        referencedRelation: "clientes";
                        referencedColumns: ["id"];
                    },
                ];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            car_type: "Hibrido" | "Electrico" | "Estandar";
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
    DefaultSchemaTableNameOrOptions extends
        | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
        | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
              Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
        : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
          Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
          Row: infer R;
      }
        ? R
        : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
            DefaultSchema["Views"])
      ? (DefaultSchema["Tables"] &
            DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
            Row: infer R;
        }
          ? R
          : never
      : never;

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
        | keyof DefaultSchema["Tables"]
        | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Insert: infer I;
      }
        ? I
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
      ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
            Insert: infer I;
        }
          ? I
          : never
      : never;

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
        | keyof DefaultSchema["Tables"]
        | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Update: infer U;
      }
        ? U
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
      ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
            Update: infer U;
        }
          ? U
          : never
      : never;

export type Enums<
    DefaultSchemaEnumNameOrOptions extends
        | keyof DefaultSchema["Enums"]
        | { schema: keyof Database },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
        : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
      ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
      : never;

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
        | keyof DefaultSchema["CompositeTypes"]
        | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
        : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
      ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
      : never;

export const Constants = {
    graphql_public: {
        Enums: {},
    },
    public: {
        Enums: {
            car_type: ["Hibrido", "Electrico", "Estandar"],
        },
    },
} as const;
