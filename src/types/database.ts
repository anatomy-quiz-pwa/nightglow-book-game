export type Database = {
  public: {
    Tables: {
      characters: {
        Row: {
          id: string;
          name: string;
          area: string;
          image: string;
          description: string;
          dialogue: string;
          background_story: string | null;
          script_guide: string | null;
          script_hint: string | null;
          script_question: string | null;
          choice_a: string | null;
          choice_b: string | null;
          choice_c: string | null;
          choice_d: string | null;
          unlock_question: string | null;
          unlock_answer: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          area: string;
          image: string;
          description: string;
          dialogue: string;
          background_story?: string | null;
          script_guide?: string | null;
          script_hint?: string | null;
          script_question?: string | null;
          choice_a?: string | null;
          choice_b?: string | null;
          choice_c?: string | null;
          choice_d?: string | null;
          unlock_question?: string | null;
          unlock_answer?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["characters"]["Insert"]>;
      };
      users: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      user_characters: {
        Row: {
          user_id: string;
          character_id: string;
          unlock_time: string;
        };
        Insert: {
          user_id: string;
          character_id: string;
          unlock_time?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_characters"]["Insert"]>;
      };
    };
  };
};

export type Character = Database["public"]["Tables"]["characters"]["Row"];
export type User = Database["public"]["Tables"]["users"]["Row"];
export type UserCharacter = Database["public"]["Tables"]["user_characters"]["Row"];
