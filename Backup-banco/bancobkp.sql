PGDMP  !    +                }            clientes_v6h2    16.9 (Debian 16.9-1.pgdg120+1)    17.5 "    :           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            ;           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            <           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            =           1262    16389    clientes_v6h2    DATABASE     x   CREATE DATABASE clientes_v6h2 WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF8';
    DROP DATABASE clientes_v6h2;
                     clientes_v6h2_user    false            >           0    0    clientes_v6h2    DATABASE PROPERTIES     6   ALTER DATABASE clientes_v6h2 SET "TimeZone" TO 'utc';
                          clientes_v6h2_user    false                        2615    2200    public    SCHEMA     2   -- *not* creating schema, since initdb creates it
 2   -- *not* dropping schema, since initdb creates it
                     clientes_v6h2_user    false            �            1259    16400    clientes    TABLE     �  CREATE TABLE public.clientes (
    id integer NOT NULL,
    codigo character varying(50) NOT NULL,
    nome character varying(100) NOT NULL,
    razao_social character varying(100),
    cpf_cnpj character varying(20) NOT NULL,
    regime_fiscal character varying(50),
    situacao character varying(20),
    tipo_pessoa character varying(20),
    estado character varying(50),
    municipio character varying(100),
    status character varying(20),
    possui_ie character varying(20),
    ie character varying(50),
    filial character varying(50),
    empresa_matriz character varying(50),
    grupo character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.clientes;
       public         heap r       clientes_v6h2_user    false    5            �            1259    16399    clientes_id_seq    SEQUENCE     �   CREATE SEQUENCE public.clientes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.clientes_id_seq;
       public               clientes_v6h2_user    false    5    216            ?           0    0    clientes_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.clientes_id_seq OWNED BY public.clientes.id;
          public               clientes_v6h2_user    false    215            �            1259    16440    ocorrencias    TABLE     f  CREATE TABLE public.ocorrencias (
    id integer NOT NULL,
    data_ocorrencia date NOT NULL,
    setor character varying(50) NOT NULL,
    descricao text NOT NULL,
    cliente_impactado character varying(255),
    valor_desconto numeric(10,2),
    tipo_desconto character varying(50),
    colaborador_nome character varying(255),
    colaborador_cargo character varying(100),
    advertido character varying(20),
    tipo_advertencia character varying(50),
    advertencia_outra text,
    cliente_comunicado character varying(20),
    meio_comunicacao character varying(50),
    comunicacao_outro text,
    acoes_imediatas text,
    acoes_corretivas text,
    acoes_preventivas text,
    responsavel_nome character varying(255) NOT NULL,
    responsavel_data date NOT NULL,
    criado_por integer,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.ocorrencias;
       public         heap r       clientes_v6h2_user    false    5            �            1259    16439    ocorrencias_id_seq    SEQUENCE     �   CREATE SEQUENCE public.ocorrencias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.ocorrencias_id_seq;
       public               clientes_v6h2_user    false    220    5            @           0    0    ocorrencias_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.ocorrencias_id_seq OWNED BY public.ocorrencias.id;
          public               clientes_v6h2_user    false    219            �            1259    16428    usuarios    TABLE       CREATE TABLE public.usuarios (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    senha character varying(255) NOT NULL,
    permissao character varying(50) NOT NULL,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.usuarios;
       public         heap r       clientes_v6h2_user    false    5            �            1259    16427    usuarios_id_seq    SEQUENCE     �   CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.usuarios_id_seq;
       public               clientes_v6h2_user    false    218    5            A           0    0    usuarios_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;
          public               clientes_v6h2_user    false    217            �           2604    16403    clientes id    DEFAULT     j   ALTER TABLE ONLY public.clientes ALTER COLUMN id SET DEFAULT nextval('public.clientes_id_seq'::regclass);
 :   ALTER TABLE public.clientes ALTER COLUMN id DROP DEFAULT;
       public               clientes_v6h2_user    false    216    215    216            �           2604    16443    ocorrencias id    DEFAULT     p   ALTER TABLE ONLY public.ocorrencias ALTER COLUMN id SET DEFAULT nextval('public.ocorrencias_id_seq'::regclass);
 =   ALTER TABLE public.ocorrencias ALTER COLUMN id DROP DEFAULT;
       public               clientes_v6h2_user    false    219    220    220            �           2604    16431    usuarios id    DEFAULT     j   ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);
 :   ALTER TABLE public.usuarios ALTER COLUMN id DROP DEFAULT;
       public               clientes_v6h2_user    false    217    218    218            3          0    16400    clientes 
   TABLE DATA           �   COPY public.clientes (id, codigo, nome, razao_social, cpf_cnpj, regime_fiscal, situacao, tipo_pessoa, estado, municipio, status, possui_ie, ie, filial, empresa_matriz, grupo, created_at, updated_at) FROM stdin;
    public               clientes_v6h2_user    false    216   �,       7          0    16440    ocorrencias 
   TABLE DATA           }  COPY public.ocorrencias (id, data_ocorrencia, setor, descricao, cliente_impactado, valor_desconto, tipo_desconto, colaborador_nome, colaborador_cargo, advertido, tipo_advertencia, advertencia_outra, cliente_comunicado, meio_comunicacao, comunicacao_outro, acoes_imediatas, acoes_corretivas, acoes_preventivas, responsavel_nome, responsavel_data, criado_por, criado_em) FROM stdin;
    public               clientes_v6h2_user    false    220   ��       5          0    16428    usuarios 
   TABLE DATA           J   COPY public.usuarios (id, email, senha, permissao, criado_em) FROM stdin;
    public               clientes_v6h2_user    false    218   ��       B           0    0    clientes_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.clientes_id_seq', 2692, true);
          public               clientes_v6h2_user    false    215            C           0    0    ocorrencias_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.ocorrencias_id_seq', 3, true);
          public               clientes_v6h2_user    false    219            D           0    0    usuarios_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.usuarios_id_seq', 2, true);
          public               clientes_v6h2_user    false    217            �           2606    16411    clientes clientes_codigo_key 
   CONSTRAINT     Y   ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_codigo_key UNIQUE (codigo);
 F   ALTER TABLE ONLY public.clientes DROP CONSTRAINT clientes_codigo_key;
       public                 clientes_v6h2_user    false    216            �           2606    16409    clientes clientes_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.clientes DROP CONSTRAINT clientes_pkey;
       public                 clientes_v6h2_user    false    216            �           2606    16448    ocorrencias ocorrencias_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.ocorrencias
    ADD CONSTRAINT ocorrencias_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.ocorrencias DROP CONSTRAINT ocorrencias_pkey;
       public                 clientes_v6h2_user    false    220            �           2606    16438    usuarios usuarios_email_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);
 E   ALTER TABLE ONLY public.usuarios DROP CONSTRAINT usuarios_email_key;
       public                 clientes_v6h2_user    false    218            �           2606    16436    usuarios usuarios_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.usuarios DROP CONSTRAINT usuarios_pkey;
       public                 clientes_v6h2_user    false    218            �           2606    16449 '   ocorrencias ocorrencias_criado_por_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.ocorrencias
    ADD CONSTRAINT ocorrencias_criado_por_fkey FOREIGN KEY (criado_por) REFERENCES public.usuarios(id);
 Q   ALTER TABLE ONLY public.ocorrencias DROP CONSTRAINT ocorrencias_criado_por_fkey;
       public               clientes_v6h2_user    false    220    218    3231                       826    16391     DEFAULT PRIVILEGES FOR SEQUENCES    DEFAULT ACL     Y   ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO clientes_v6h2_user;
                        postgres    false                       826    16393    DEFAULT PRIVILEGES FOR TYPES    DEFAULT ACL     U   ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO clientes_v6h2_user;
                        postgres    false                       826    16392     DEFAULT PRIVILEGES FOR FUNCTIONS    DEFAULT ACL     Y   ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO clientes_v6h2_user;
                        postgres    false                        826    16390    DEFAULT PRIVILEGES FOR TABLES    DEFAULT ACL     �   ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO clientes_v6h2_user;
                        postgres    false            3      x�̽Ks#ɕ.������k���ћ� D
���T&;E�,1�e�ڍ�E[/�j���,ڴЪm6���9��L�ȶ�D @��������Q*h�.��z^�ų,�w�.�H��n�F�$�ЄY�[B�p]?�~y�|��1�>~�??�r�����ct}����!�z~z��ǻ�h9��?�>~:D�׻_����!�Bb����ԣ LN��S��R�#���R���G"�QЄ*#��4"�����!�����=>�������$ &�H�L�PQ:]�=�m�\-��]�\��E$H�4K�UHL$���FW�w���߷�0�%DY�I��أ�� RLO���u�=�_���(έR�3X����~�c����`���Xk�,�||�z�����o՜+=��Pf�����u�[��o�[X(l�aӌ���_�6��]��g��*^f�&[,�m�ۤ���z��k��K�����Xv���~�������/��܂Ǎf��)U�ҫ��Gve��~LW�M�.��M��W �t1�Wy���'mB�-@Ij���n2>��{��R"����0{��D$@��0C��}7W����t�L�g�t���ك�&ĊĘr�A9=|������I+�R�R[��m��)#�q�`!¨��x�^f�i�F=u����b����2_�o�%B!�yBy9�}�N������-D7�0�$YV"+��.��7i\�.��4	���5��T"���~�VYBO��ľ�6�^w��������6<�����ƣ%���[؀��Ld�_�bc²���y�$&<�q��t
�����u������1l��z�g�t���8!
��'0�D�r�D��:���_�>=��=NH���e(F"�Q�J�0�e�\������:a�0�������\>�wU�h-$��ұ��P4���
��}�ɷ�D�v
7ϗ��ȍ(%D����`�����㩹�y��U��[�`�\�L��t���f=���=�M:�7�0B~��X� ��5+~?���������O��b�cz��B�r�+��]���4���
��"�D�Ӫ�!uV��*EZ�@�@�l����x?��@\P��~��^{-�F7w__�㩣�� ���I�!���g��*��5~5Q�WV�3�F���`}F�&�O	���>}�8SD0b�f&P�3~V*�3~�.����7�g�����/��8cV��0
Ӻ�0�M��q���8���|�!ld��ͅӘ�-�ؤ�|��wv@��ȳ�m��:��v��`�ZBE���L�'��f�Ա/l������-��o�@?=�~=��p��`>��`��T-��[^��A�qtW	Q��J��ǽ��c5`:9�H����E��ޛeY�r ��v���)�{�î��<������n4�s���Uj*D�h11Ĥ0�	��>s���`]	��`�k=�@D`-�c�������k�`{�]��rt��G���f�9���Q-9�I $�M�����|}���+�[k�uW��Z�8��8�ً�7q
� �:N�;@�����8H��M���kx�་Ĳr�+O�$��]3�϶W 4)�DW�Er���V5�I��I�A,�H���V��1��L9AR�!�`{A���u�З���Ꮗ�/[�U���c#��{�Q�mέ��~i9�E8Y�9'�J��@@@{!���i�<�sg�Li��x��S;���?x�Aհ�����(�{B�0ig1��6�P]���4��z�m���z3OW��"��Hi'��I(UI�c[?o��%����m�G1M��m�t����ј�.����$�C
}iw��?��,�C�����_D�t��)��(�}4�%��D�����W���w/����}Gbqk����&  �"���E�Q���\������q��7�t����~S�."�!xBu��~[����0>���6SGQZe�1�.�8�z���8U`[�s������B�V��"��G�S|IDl"I,�u�{���mh�jO�]຀V]oq���ۺty@��em���)�9܃��<�`�k�L�J|��=e"�����|{�S�P[��� �M���U��jj�q��i�||�',H}���k�؜��μ���f��v�2s�Kۄ���s��_>�L+b�]T�,�J
�tH���Y��m������a?��&6�h��!0h��Vh�h�����&C�A'	��tx�x����S�/��C%,j�J$���-#���e�^N�p�H�N&�\u�_��+SRpkZKG���v&!�Q��x��6��#��k��򯇯w][�0��z#-�V� T��Vx93��K�c�����N �欟P�Hp-@Z�v�z���o�������Uvs<{\�s0!�d�AI��R�~�#����S�h ��"LŞ?~�Ziڋ���5��~���Ip�'L��WPy�����ȿp8�eg� 8l"��������S[�\<�V�+n ��q��pT��.��p���*�ِfTQ�%ᝃ1�t��Ǘ�x抁I����FN�w�g�t���Teڂ<��m�1a�ޒ��� ���������Z��	���ؼ����>��|��O�=J�n�Ǚ�h� 4�}�l�.c�O��E?v�|�6��!�*��(��bp�	���4}~�;�",���96
0#`���P2�~���`�?��I�M�(�H)�4`#Q0��#D�����dG�u�G�7�Z(�^n�|�n׾�ز�ls�O���E�+de����`4��������c@��6P3�@|�}�`|lB����0��dzw=ja$10$Z�6?�@�q��89ܼ����ݯK�|�]���
X|L����H|@L��W�Y�0n]��Y�ju��1=x��*#�\i�a��dqs�/�:Q#rI�
��*��_������|��#Q������\`�����UWmQ�Y��7y���[�p_~}m1v��p&�$JKي���
��N5P��Wk���|�X}�1�>�u1�$R�Ċ2�ާ>�,<M���=�@�1���#��W��|�����@�$��E>����SFܐ�^�t�H�װD�i|��`�@�[����c4H��:l�� \3���Y,FME}������ta��z���|��6�/�$�a��V����G	�R%h�3�F�R����f�?����Vl��3��M��-9��>	%L0�\�cn7��K	A��a��z�a���U�hգ�c#�g���,)�s�M��"�m�!����M�%	5eS�'�Y�1��Wr���A�@dHB�)lO�g�i}1S�q�^I4X�6��	B�Cg�U�v���P4� Spp�*��,�:���d�˨@;���m7g#���b�l�a1�%��r��~��S|g+@����q a�$�I�c�꧅�\	�X������L�.��.�������Q�ZJ#FZxX�`��|�mꋷ�G��I�İ*e��ጬ�F)�񁖌(K����.KLw��L��#qp'��$���>>|H>������cG/����bU�L $�	��&�[ł���!p�u	/UQ���Dor���D�|�����U⡉�:�%R&��LB8��j�b�uC�o�KCA��;B�~�]��E{r~s��ؾ��˪Rp��̹�ZK�=xm8l]�!�%�rl;^��<�R�i��IkO��ȍA9�I�3�� y�tw��0�l�x��	u9`�S+��q��&�t�4�&�+Ad]�? 2J��4i>�P�H	�][<�G���ǋlu��x����v��ve�+�5L��݌�!�N�;�@�X�q����q9��"#�\t�H�A�]f�]����L�-ȟ�����y�W�ٚ�������(����LA�&�r�'ٴ���7LQ*�O�MVx���v�ܩH�DK����.�������=�!x�c��}�~xtdm�2$��;ɛD����p�pDCg@�    ��3<6Q�'�g�a�O�H�~@��-�Y�ޮ��b/A�β���PL�Ե������0�y
� Ż��q�v��J�U��U%͉~IX�E`�I$���$�H��{Kt��1�5�h������$.�3pA�x� -�*g�V%�M��22$üA�7����$�p��T�&)a0�Z}_�zbC�A�	sD;�L����ԉ��]���2Z�G��V[�g� �.�����D��l�������xs����c�Z˥­��;~w���������HB�z����rL6h�1)H��3�B������	�_~�����Gw_�v e��c����1�D�����t9�A�%�Z�#aFcʰ���F?+�q���(놁Τ5�-u,�1��"g�O��y�R�����S4δ��ȝ	7L�1�a��?�~_�|B��3�7��imu�9��۾�Bgʷx�4y'� ��H&�C^$*��M�ҫ�2�$׫|)�#�|�
6�(V7���;��[G���z�k'�,��������"����j��f5���9w���i��ב�"�<0[=
�s�����Di���V�����"n�	G�ԁ2OY�Nj$0�ڭ#'l$�h�=3�Q"�y&��_��w�(%m��=�?����Ig�3WV��` It؜X_�y�bp���P�IO�H*�H����$&%�'�N+K�88�|$��᜙�8��0�&�����8��hUz�Á��7A*r��'\1Jǚ)��]BE�L���y�e�c�x�+,Hr��=N�L`�v$�Ld���zpO��c��U�v8�ȇ��B���r<Ӆc�8��Z:��Bꮑv=��EGa>�`�۠�������f�.��u�@E���|'B�3�N���"d��D�56K(SQ����z��ls�_���˅;���K��J���"���3�G��p����6��]RN���xL��	m�^�D��i�$L�t�c6��YϹ��H �(ϱ��b,c���s iXt�ҏ9.:eX���+�X �@�e�:�]|q���7���-���ly�t��ޏ�����|��7�� Cq�h�Q��8Ae�i�1䭇ヅgA�W���Pbs�t�wY�D9/M+�u�ƀ����P���H;E�f�E򟲉�V�<��y��t"��+����Պ���8��і9><�v�����5T��j�V�l���twQE��ǔ��.���VjI@�"�`��Z�T��
���(��6����A���?�׋t�]���Y�n��v�B�e��!�U� ٨"&����l�VZ�)�Z�+�L�0td4؃0�]�\�aݺD�es��sU�m�,��W�z����|�C�"������4�Y���/6�*��'G�Y����i]g�W��9��I��ݏq�W�����I�&���� �F���~��ϸ����p���r%�a�I��Y8�c��÷ g&~Y ���
��E����\}�[�0W�X�rK�/�~�EL�F�����:�n��P)ҍv3?��q��֕�b6+��� s�t*3������&�E�1z����9���˿�"o7^��D7Y^�� 9"eª>L=���lw��Ф$x�d�y�]��) C4�>r���z�7Y����U��(B	�1�����i�@a(&�+7r��i�.�H;�M�ޕ��ѵ����]�f�N�8wpn9�^��8bU���n�V!�;М�BC!��P|�r�Ė��pq�?��>�n�����Z��p�	C�K�{!�@&���f�(f�V# C�K9Ɯɉ�;�9˿�T���p�УM���>׫�G�����b}�.ެ�vmZ@E[dR�4���t骂!�p�GR9m懲�v�:�Z4mE9�q�\C��6��P�H[�8��2_m����J`��םu�֣#!�z�9�3��0�u��q�����S}ah�\��G����^�����j
c0��V�a��Ab*<6��߳�͕#.�x_�H���0�,��� �6��hj�/E��Yy�on����Z	�;S���x`���{�}ל��KM�dc Qx���Md��?|���(�������H+l�����r�[b���$U�戝Oد�FZ���t>�Hr�1�k��;�w"��	�4���;���~Cے+�s ��v����Z�ѷ#h��&[�aP�歴(�`#� �OB �Y��0=� �:�J��ͱ8NKhDGD�����/�N�	L�6��)k���:��"W�ߊO��߸���&h�VMF����||z~�t��B���l�(�<�қ-�,K�l~BiN�,Z�=!g��)�Ȑ���˷�u���"�m4�f7�,���vPݵ�Y�"�60��a�|�HHvU�����o2݈BA�� v�,uG��4�� �u�Mݱ�n�Qs-x�Y��c�l�^"��48h�t����5�W�/�((Q�c���R|	���f/��U:��>ZG�5#<��3��e�ӡ�qZ����������ß&�"F+x��Ms3��fdA�ͲEv����M���/��*9��;�^��j��m,�-Ul�ͷc�0o�L�W�Ds<��S�|��?��GPb,�am�dEQ�l -C	���LZ
��^��Pu1��j��Q�t���]�kbێ%A&��FR��e�	�l��$�#"d=xN1��ȭ,�EI��X4hɈ�]޳�Y�=�Jw�H�0�*���ˋF�gQ`��h�n�����v=ͳ��T�<1��;Ye	��uz�l�ゅH�3g��P���&��y�.�*1�&�6�f�������:���aJ��ef��)�"#d �G��� C6RӢ��e(����v���Yf4 fD�w���<�����+F b����>}c� ��HP@�p�zC���2g�D)@ͳ0
@lo �zw2?�Z�ň�t���02�x�|:<|�0�b3.��y�� ���O�7K�[�D�,�c@E���b>`qY닌9'PРL��*��P��0���"�\�Na��fU�����"v/�M�2zU[U�/��{[s`Nf{Ls�^�èM4���[�������،�5�ix1�b	�x����M��j�Mכ��Ҷkِ���e[
N�j�K��O#�%�FY��/׋9�fI�J�O�i/1�Z&��z��7�`BX	ʒ4.�.����&Y1��Ĳ� 4���\9|��؉�0�h�mz�1,x��qa�N�Cpy�������������#I,LEß��xuHإ��H�W��Q>�QUd9��G�O�j#m�E<C���w{�����v���ʑn���D�ɗY�-�n�_��T\	 �ݱ+)Q�&�̞l�G��x�β}�S|�bz�.��1���0ب8��jY>�D����T$P�uP�	���v�W��&��x����+�ix�R	X"u�-̠�t3���f=}�����&�_���pS4�|�����)�<?�p���/oWf�u���W5[�{9.Pp�[�&��5� ��9�p	�m�mhlIR(��=X��`CTG_�&������˝����*m�,�}hD�:��ُS�~��C�̺�.E���&_�Wym�y$`}^7����ET�#,�H�h�]��/�W���,v��q���̿�z�jb�k�֪N���=����,x�@	�=A�G��D�p+�7�V`����/�v���H�"���\Na��%�m��U�� m-�&SG�I!R���MD�崕q�`��/FÏ��O��М,Pi�F#�*��p鸽�tc=��i�� �&�c�2)���s��N�+<�z:�Qw����|b��Z���[|#[ݷ�G��'ֻ�ZY�z����g�������U���B�LK�5��Sh�{&�no���y��pB�]y�ۛ��H�oߍ�:J^�����]�KǮ��c�����c8r"�⎰��?ݾμh�����+b��1(1����Ie�M05�2bs@_�e&��C�c�.]S�պN��(c���w�ѩ�
gH��D�ư    WF��|����@�㡳�(���Hiʉ;~��(9�K���U�o�Jj7D��M��j�KLKu���+WD�Ŗ���E%�2�)�"b�N�?R����߄*0&#XOA`����8S���"�:�w�v L��;̰d;4�xrT�]u�ެ�[�M�$O�bc�uz�J�D�"��ezQ$�V�/���6�Y���7��7�k�%Z��\��spO����vcv9��8*_P�9@�9[a_���0m0f[5��	����O�1�x��FS{�6�˿;��.q���S�z���_��������V����`Z�j�+�i�!�{B�x����O��ϭ�3e�H[t�ʣZ;�"� Hܷ� ������ɐk���"��:M7qs��:���-2J�&+  |�c��X\���[�-����MuB�톴ĂV	WU8�{�Af��0��z�2�,�C���i'C�9���ة�CQI��
|y����{�n۴�p$������ul
n�cc���`�Ξ��|����𗻎�g�4�Cޢl�O׫�z/C泬�I,��~WXJ��	���[�P�v^�����v����%]��+L=	�$A�rˢˋ����L7v��)�k����#�F�z�^^��Z�HPUz���s��*-�G���1yaߒD��k�Ia���Qb�n��)^7���%� N�3,5��J^'��Ԍ����j�%lZ�A��ze�0�ʽ:^�A'ܧ�2*5x��s�y��p����7[��Y�\��lߴ���8rﱄW)L�������� �a��aXm���˻�޴))z��Z����nwp���N\^n3%-�;�`��#%l�k �~�Cq�.;�o�}�߭��?�����(yR�p�����J�������l��G2Մ�0U�r��i������l��];�Aq���L��W-�l ��+o���!��Z��W��B���H���n�)2 �q�SZ�Ry�1�ДQ�7�8�?���R�bW�˃�`���������ْ?b#����ZoB�D*U+�qh6`����d� �svk=9��md��0�w˸}]�
@�i�*�d;VI3e`�IIZ�����v|4g�ܽ���j��JGp�o���hM_U�;q)���a�v���˗ᘰ�T�h��v L���t��I�I�nA�����n�<���°yv������L2�HY4�]����8G*�`��&сJ�;�G2p]-����Gd�-�.����&�Aj�@�DJ$8(5�+[��)LH�K���)x��y�a��fI�m�=��Jg1�K$B�	^=�)N+.a��|L(`g�h��W�/�=x6�6�H@z&��^E�n�w�4�94�0bT+.�o���nX�R�دv�{i��3����撽�.�Z��� �K�*�Ԉe
J[+[�y
���z����1�CY�'�b�r�&oC����G.f4ĥ�X��"6��L�@��q50q�+�[k�e�J��T0k��7�IL��c�I08������+����!<�!�V����(�(�4@�<|8t:x a�֣ �8�b���W�6��;�VQ�=��:CJ~$^���W;}����e繁�c���OO�??�d��6N܉��:�U�Q{�3��O������.0��$�c�l���L�\��T'�T���B��m:ˎX4&��`�!�%���}�٤�۫�0O�����1�X�xj:ʯ���F��|]w�{��{|������m��EpM,5]e�5�2怚^3�}ʯ3�g����X˴bt4 ����@����������u��@orE������=	Gn���/���O��N.We3�1 `R��} ��s�y�AZ6��h]��о䛎����<�����A`h*��]����*��Y&�R'���I�j��!\y� i]j�Ck��m�n��o���?�]i+	�z����VY���X_g�L��*��/�M�Xc�^�L,l�Q��L�c��Ã�
�+8�1�ڄ�q��T��f�Q��&��AD����ED
6@8�6�7�3=tA����D�P<����~���i���pH6R|�.ҽRo�j�d\�	� � ���7�Llg�Ў�F\�;�~�Y�����|�E+���v'Тf��R����:�M9��3,Ҝ��'�ә����.k����#r94��Lq���լ
6=�֍穐�^U�f�~�,��F�\V��M���
{�i]�W.�q��
�^���&�_����" %CZ���_�������W��,-���"8K�7�q99���z�.��bZ�������섐�ב ����t����$�.R���|�J�C�xw��tz��I����$N?=~��I8E��z���`��s?TqV��g�4��T�$�l��^P�#(ҷ��i$��X�W���U2�/
�[��F� 2�y�|%� GA?���?�B[�p�"�W	�=��$o�&hf�0�0�;��X/����(XD�ɅAX����C��RY���s=
��k�`]GP ����~<|��X��ף�t0���0Xַ'�rUk��dm5hr=ζA����9������i�s!�((L���A(��R�Y��c,���Q�����GH8����9�S�_U݊�1��Ä2g��!�db}�ݱ���y��fz{7�|x�R+M�%�쏎a�����=h�x�:�fQ��继ï�IϚ1�Eƀ*_�0ލM��aHQ�� W� ��a���	�$�ٖ������6��!�[�lgN$��aۇi�2�)*�?u	�40Iz�E�"8E�L���9M��2%��P:��.�/��E��n��8���i$�+ּ���m#�Ɋ"J�V���6��Ƞ#�@[�E�(,�RW�0�v�>(���r�a��QS<��3ߦ�0����l���V�"�4�@��� �����/GR��,�?��ݤ��ΐ����Œ�)2]&���Q�/E�]�HM�2o���wca�R�~�\��/fY�L�w�E}��k0�c�DOb���v�0����UzGWq_��5\�y�^�\l0�Z|�2����My�t�.F��H+�3��#�l��`0�ƓU����T��u�����N֭5�)�&q�=�U��������%����K�4�߆U�f�;��'��8�M
�d�3h 6��9&���i�z���5VW��M�>��e��GK�6gW����tH%4��R�����b��bC~�ܮ6�m]%��L6nU�6�����7Fz3ߓY���(a��=�@�`�#�� �������D����O� ��X�U&��z��@G;��a�:��6��`hm$d�If�0p��q���jƙţn2�qd�1�Ё^��ȍ�����C�L��2D��%�n�h����w}�������]Z19��XV^��%�52�N�%ш��\��p�Y���*���G�y�_(R����f�{�VeUH.���:Hx
�it�x������m�S#�`�N�k�:|a��[Ï/�wyzB�_��%��������銩AK[ƅ�B��P�E�<��0�·��������CT2%���L���p��z{4�^�eO�nf�KQ]`1����)�q�ɖG+
������|}����B�PC� �(�:�G��oCw����ь$F���:���t�ci�sS��Ϸ�����cǀE{�2]���e����\�1أf,��6)
2;�����>H4�E�e�ȱ�<��|����}��ݪx���W�g�a��ՒI�Mͫ
���fo��`����-�J��w}��/��P� \�l�cEXk�W��pW���X������r\x!f9�&U��D'Ϭ����_� !qX$~ X��}`A�O�gL���0
�b^R-��AG`�A��0�'C|�����T����7�����*sĜq}1M/��"۬�Jl$Ve�j��쨛�G__Q������rbr�������'��*�������W��)$E��(�L�7c!�nHCq	��	[��?]�˿���6�}�pR�|�����0n��ϲM���    �O�j��`&���۶����&˱J<��>�N;L6�H�A���>BZ�[e9�P�,2�5�V�;ܸ���K���M@L����mp�/��(�A��DEi�I4���X��oc�sY:�:Y84��3��m���?�9�����dJe���B)#dg%�e�p��o�箔j֕��hؐ�Ō����{��+F@��1c ՝�J}��IOʭ�-Rá��ﲎ�=zx���b����/�{=q��;Q�X�Z�T�n
)��Còoi4�Q����|�cTq��s\��E������ � 򡷰���v���"�0+������.�T��DV�+T?����R��v��
���]`a]��Y��+����&�_�_��h��h�5`�TL��G��ɦs�)���
���kPKy�`����Ŭ�Y}*L~�]�yӝ��qM~��Bf�3u^�Me�9Q�U]m/�|u�mwUȢU_R:"
��!aA����O/=��2 �KbTF���ڽ4��K��oj�$�YE*G�u����n�%R�G?�����ۀhS-�ǂz�jv㨇X)-HO~��Y� �!�H��������p0�뷜L+Ub+.�a|Pm4ŗ���c[!@���80(k��M9#���|?,���^.��H���m���|F�Ϸ�8<=�v�8��l%�BTy7�o�D=�$(���%��i/cР0iMOv�2�+=�;�8U�%)B��3cL��d+�
�"H�Hc<vph.O�/GR
XV���I^w�IT����yZ����7P�e��9���%EI)	p�N����Zݳ��4�������Mkf�#�#�#c���)^ϝ�#�';�Q�"���M:|>t�e�4�	/�?�n��m,5�i�mD{�%��Lbjtur1���fEW�y��z?����![ج��}:٩�Ċ���F�@.����۸H��fye���Ye����-����g��.�:~��a�=�(#"t�1�R�s��B	�$�u���	}W��	�Tݓ�
����1�B�H�D�k����ǧ�����Z2����C�(���7�(��/H6(L�#^��(��°�)bH]i��Q�`��9�;�yR�aB�~�+!���t��0����4٫�y���R�b|�EDAB,r0�pF���4]^���xJ[�����;��4k�a�R|l� ������&lH����젊���8C��=�y�}�H�������D��D�#)�� /6J�l��o�\��g�h����a� h�Lt���sL�Ƞ֠)���=`ڤ�E<O����5vu�`���D��6b2�6�"kK�����X<�muuq�^\+���t�7H���@Q�9
)=c�+�Z2�*<>l�p`���n���R�*��Z�-�ʐC?/��s������S$g�NMY�c����b�YB�<"��N��!�M�_��j2â����$����|ۮE�vV����B�No��(i%s�* �G��԰���{;^_g.��~�1N۾��K���R��j���;��e`�ˈȢ@k@`���m��mn���!
9�Y�F���kê�x�S,�;{11�.?k���E�\�2;���3���r{p_���]6]�Q��F{�ϳ���e>����&;^UA��_g:dq)�j���� p��a)t��4�~�n0K�����/��Q� WQ\�"�s^�����9`b%?r�U���Qy���2I�k|��2���A�BFD�}��3T��X@�q�1�=9"61��kҬF236Dp�	"�<��Ǡ�0�B���IijD�ʗ3�4a�R��V�hzDh��a,pV%�)������=��`���c�&��(���`c���>�j�xB�D��� (��A*�2N� 5Y�`�6�!�e�9�VǌU�=���u9�,r_����}u�������C�ʦ1juq��7O�ĀDջě��M��݇�Fյ��F����ģ�@�Y�]�7����3��^W��`"�Jr����l`�M�F��hBH7����t]<!-�q��F0$�� ɉ��dΜ`ra$#�}����C�&�Sb�>�d����XTs���#}xNN��pj�"���0��	�E>�SS[E�el��0���D�'̻0d��tw��lӌ&r��m#���l���z��ߧ�t�^�b� mh� ����B4g��ڒ��r���jt��v��D]c��L��f0�d=m�OA���� {��'(âj`���]���E+�]���+���AI�g��o��"�M�XlZ�59�u�c^� ^o��.����1�Y`t������sTP'�!M Y�=n��Cq}ʌ���lU(��2���$3F�v�ДzAE���X���jW�m��4}��%�XU��~��g� 	"�L��U���vI����c�O��!k�گ���	�_�t5Em�q�)��U�����7�.85CPL������e���Of�p����`4��#�j �84���/6�oFS+���;�2�A(�/�#)��яR\Kgȍ��4�D�R�?�Z�~�r6�H��}�����:J^�����]g�*4�گ�9�#���vP z��K?�<�N�Xfn����:�ݨ��V`�c�����e7�E���-�ms��ة6�>�b�� �S@4��P0�f��J��e	!BV3#T�B���J>�զ}���z���,����<�u�@e#4�D�D�2"�߸������*�@(�z2�g��G``�=��LD�h���Td@\�mv�����t��D�����w �5ۦ&�K��D��I1�P$:2 .{#a���>�|�K���c�UJc�i�B1 ���"&��8;]k&�3��Pp��4[����}
���M�l�`Q���;u�e�:���t�(yo	~�G�-����B��*�w���G���O�׳ʳ]��,��_^f��U�΂���)�i6Y��r<�`�4� ���M߭�b���_�	C*��2+=@�0�S*�AE�e*�����x	+�Rk[ޯ��{u��/Y���q��;!E+�.�;���%Ab���m�a�H�G�HH&jFj��Q�
ئ�7PG���+�o$U�m��S�f�v�4��W�tq�m���WKx�H������4�fHM��f�M>ۧ'�g7h}�)F8,X8ZT��إw�=�Q�����n�y��V3� @!�#J�*���j������S���Z�D`��y���P�G�8R�þ�P[:��j6he3(^�<!0��I�� ��F��*���atD�hy��/]��b��Da��2\pH�]�߮u-J]U�
�Q
�2_��-��%���y�n��'yu�$0�j�EoN��Y��&�ăר Sయgr��������e�����2�Fl�>$J,0�T�Ә��ҫ��,J�[0m�d��X��㏇/�����ǲ�V!�b*s����q���!>5��I�rm>>><G�(7JK[&���|8�^�6 �e}�f�� �gx"��K���ԁ+)d�Ci8:��p޺Q}���Y�4dG��Z} �qI�2p�v.���z���ڟ��$��&+8C��M�O�4�2Es�,��B��P��>��M�Ȣw�^]�nS(:�kW�4]��V��\�:a��	`���]��ܡ�X��l9_Ř�!�A��˖�M��f���O�幸�� ��ƣ��`���/�\$BI�x���X�Q�Y�9#�5v2����N�آ�S�I�DX:,�䄥~��"�|��v��&Z*5���a)|�S=J�_��d���g��!���C���f��˷�Jb�!l��V�o�fK)��5-�1�P����@����ޛ�N���q�E�Iÿ6��v=�PdH�v�~�������I;��Qf���&QT�VQȵ����%Hr K[�����F%����l!��
?A-b�pQ�4P�Kq]#��L*03�G:�9J|�h ��?���/_�Ġ��Q��s=��x��w~�f�=�OH��)�@�o����`b&��#�K;�8�C�    �%��GCƉw�)���3:���a&�ǌ��DJ�!J_;\���y�i�l�+��+�#�GJn��ۧ���-����@���zT�ʷ���F��u:zD�撍	S#��'L<�~ES�ʆH�:H���Q���J}��εV�R������1KFI�o�<�c|���އI���Ҏ8�V��ń{�!�܉�	�õD�1����&�y%�q/p����16(��1;HGÔ�I'o�C���F�䔆U��ĩ|�F;�nWMb�m�"cnK0
�� �ĳ-_�o��m�i��K[[%�R�H�A��1H3�~���H�$��j�d0���J���嬪�'%�J3�C>B���xJ����,��b�	n��Q�(�vL�	�[��uty���/_e`[�⚚1���ԣڱַ�l�C��#NGD��r��|<�ķ�rn���aȄ+�\�S0ƃ�S
��־�g���;Q��Aab�U ��S@�������"��1�.X	��v��;�npV�����UL	������^Ӣeެ�m4{|~��w�Dd�QcFbs)��b8��ބ�n����Ș�4�����9�~��|��b�����׮�	�(�C-�}c����4�e���%�}���x�?��I��A
��k��2]ǯ~�r��U!��<1�j��#E�,2#gl� ��-�l����l�2�����(Qb*2�>����a��7���@*xr��B��~��஖W5w=Zߝ��X)�z<<�>�I ��Q}�"x�2��`�q����S-��l���ȡP�l�� |+��}{(̐��J��e\��i�v�)��{a2[�+����ˍ%�umF`/�7�x��ъ]%#Mb	뗡~�8EJ����?�,6�Lo.6���6n_�y��"N�߲�b�=N/7U!2q�ā��y߇f`0�,� ��d`�ƥ����6w���n�eE^��H$e��)�\��\�D2�-AKwH���$�;�#�m������4հYtA�[���\V�
�a�y�3���S'!�IɴRz�Ir�z(��Fvw��"YLO�j<�ta�P<jb�B��m���p���^V1�����D�E�ε�q�F0
���P�@���m_)�
���>����p�㏇����k���T�� �`DGg��������\�J�-X!en�����$],�|�-�C�$t-��q��<IP���į�n!YS��2Z,��ʕOK{V�!�G^9+n$� �p�N{I���(V0"]����ao���DZ$�w6	Z������%G�(��0u�k���e�\���P�[��hu���X�]���'�*=���H���7S׳}����n�,[�N4#�tZ��&�f��[t9�pa��D�5���������$VbK����`�d�¦��qa�Б0��^^�pJ�Ň�T߮��`it�mP�x�����.��7w_�:ތe�b��ȸ3�P�&R[߬7��:n���W$�j��yTr���1V
Ū�A���o�c�#z0�_>�n�Y09�PE����&W�`����`2�<�=ěۏ����(˭(�GAC�0�< �oX~*��*SY���a�ۜ�ܽ?�B'��X{�I����4����A�u����<-ߺ�t�5�DR�Z�(�\�Q62��3�r��H�^���0��ګ"�B���Ȋ���^ੴx�;-���*_�R������y+{��M���/]̴�0VDIm�A_I[N���=l�L�x�"m�ԝ>�n��_O�e�A��RR���ۏO�Mש|���2������t�EO��u��x����մ�����D�t���X��UR\����ZO�p�cUM�7F�`aIh��B{�ՋG3��ZR�C�œ��: ��Jn@@l������	T��d���O`�*e��q�?�C�s�0�����j3�u���Ȳ��	o��^|CP��`����Xݏ����o�f�6ڻ��eE~JK^r {�@��%@pT�.��e4uݹ�Q1DE��=��gQQR�莀����U����Q�W���q��I�
C��P��$�X�4+^�t��v��`w �����ܲ����g�U�R�Ϡ��L�n���	�����b`��0��w�eE�y9C:�G�Y��I~��y5�(@�d��J-mq1صŦ���� �UR��CŐb$��W���,��K��׼a��ױ��a:�7^���ǧ����_;�P��Ĕ����"���,�=sL�F����T��P[���>�����l9ݚL'�
�0bN���>�u�ܤ�4��|�;<��ǫ�E��L���t�����v��f��0m������w�S�}P�^�o�w��j�YY�=t$��Ύ�k��ޭwG�s��Q�"��h9�"MA�V]=�6߇AC�	)�d�����sy�aEdB��ߎ3ZV�FҲ�#�������O��������:��*nAf)Y.���A#��2w�;מ��~Ѳ����W���@����c���f{0����b�|CT ,�fl�i�~v		�2$�Ò�ڍOW�4�d��I�M$��&�g��-N��l]����>�@͊sۻl~w���݃7�8#����Eb	�DO���s����8�"rX(�]�<݁����	��fPW�M��fy��?�Bf�t��j���D�5a�̀���V���Ot08t��1?qz����9gt2E�Ⲑ�ݧ�)�	��X�06���t����]������6"Z�h�Xh�ĳm�r[�W�������T�A
�zg����D�e��=�c�R�K����ƃ��k�&��S$Y�t��FV���`T�Q����r�/��R��G*D#_�ECO�aj��Ƃ)&ܻ�o�|w��寝�>�8�.����g"d�u��������Q��m��?����u��"N�,R����S�;|���I�([��4_8��Uч�"��]M�pWZq6J:�9Y�Ȯ����PP�_4*ǵ˼*߻P�߰������jN�,��Hn��۸<�:<ٙ�
\��A`5�P�4��Lp��u��C�\5g�Η8Ox�ĩ��$�o�6ɣ��OӅ��-��^^��(�c�1���$m�-6���
���E��Db0�g��i�>��8��QI��R�aN:�@ ���v%�uC����x�v2|��/���}�:�4�?�|�t��t�k'e�r���+ �P�6r�u�<|8�ܱ8�Z*�F<2����;x�K�u�EW����j���K�m
�?w�	��2N�Hp�"�|�H_�*XLׇ��� D�᩻��%��71�E���.�ʣ�-萻n�ɺ^֎3|Ep���K]������ṳ�#FX)F<&� ߵ���7�t��u�=���L�0"r��cV������))Z��#�.,�31��1�9�#mg�����fF|)�`6��#��n�e<o��Q33�̘/��f]F�on���)E,�
&��54��Ќ�r�]_DE�B�N�M	�h毣�N�TS�Mt��	"��ѱĒkp⯦��&�y#�&�Uf,��P53�̴o`�t�A�Jxm3�)h6�M��6:ՅoK2eM"��-���zS��|y�������x�;oОLj��@�}�.��|���M:��@xb&�Ǆ��w��F���%���B����f���i1[ho2�$l�ٺ�\Ja��R��el}(�$~�{\M^��>�ZN>֮�v�t�<�/�O\[�r�q�0�x���~�Ư��WQ��.۬�G�^������z5�����㷪��	��@�we��s�2���`�H�6]�Pa<�ޭ��|H����|�����RW�b8Dw�`F�(}��΄���؄tT�*2تc$�����KeDp�J4��,O#!4��6�q��F� ���D������}}��fi�`Up��Ix�;N���ߖ:�	���!���F��rL�w�gn:;�k3�]�M��`�X�R��FO�Jx�8]f\|��7�6����E��[��>�^W��ibK��L�~�8�~Į�.1$���    {�_�a��/����G0d\iw����|�iU%��OX]LeG>�:X(J<] ����zGm� `y��pb���b&�0��܉J�lO$DȦ1p+p����>��l;6���E�7�t3]�غ�u���'gC��M�D~�S��2ϻ��*��p"�(O��ZvWm�9���a���m��%������s�_�NX0X���Z���ėU��L �$є%��u6���i�(V<�Fv�cRim��ؽ4����i��bi�����I!�҉jF�x5M�R5<pk�A�#����{����:An�9\��گ��W,���N��uH�|04F<o;���x���-I��̲�>;�^M�p���4ia��0߆��L�\DZzG|D���qߓ�����}%�+n�8$���-zǕ�L��A!Xz#�a��t�#��d��f�B[���$J��=і�0La��$}�H�@aдoJ�E!x�}�U�����p��C'v����y�1�I�&ðߌ����q,2����QD���ဥ�s���[R��߾'<�¤	%�ϲz�&\���ّ  d� Q�T����I�ebTD`aH����]��:�D
!j��Q )���⾙��ҧ�_:��^L�xLD4���H��g "����?Rc0.���j�0\�U/�0�Eْv$D<�0Hʷ5+����]\>݂��	��T����F��ڹ��w�ջ|��},�CYB�j|� ��nlt3�dM����)�.���}�_�a����6PB��o�ճ�'�^��#ك\y����o�E���4�~:Ŋ��du�GT�엿79��NpBBRsrF�9�][ƪ��$�V�~�������p��K.4q���Ag���>��RFS���7�kf@�e��t��(�@ $���q�끈lD��7]����H-w�y�o�u�b���-b��L��3;���CQ,Ȁ�IW0�]�T��<�MC��cb2a�vR���S#��z��]� ����K��K\_x���P�2Jfz����U�#�-	�\�tji��xuf�a*��j�*�lo��) Q\�g9��a��M¨�C��9'¹`�0ޒ,����_�A��h,�Nx��.7W��:��& jBˡM(F��l�\�����!K��&���;l$-nsS����B���(�.���wyd��ױ�U�,��)��Ѽ�:��I� z���bS����F�i±̒T����T�{��c�M��$�M���� �����N�P��=�\�+�8����V��4��*�Չ�:�{��Y(FL�`p�-�ēV���	�����)�%4Q���ˡ������X���
�F{L�w�s|XGM��Nx���͔x4�'i�̨�*>GFy��g��7�����2��':t
w�~C�)^����q�I�d��c�(����v��t�pX=f``F˻��4�!Ŵ���L�t�߁�2X*����-�1z��w�tG<uF��`�0�i/��|w>�Y)nUbKtE)���u��;8�˂��y��?�o��Ό��:��<�<k�=y��J4+II�ؤ3��uKm�bߩ?|���*ݶ���JD�Iz��Mw�"���6m=�MpڀB
P&`�"�UU�������z�wK`�����}��ɔLl���i_:����@x�)�n�+����'򞭱[%&���S�`��8JO���d�o��6���8l����5��EV����ܮ�y��d�j+����dP��㧻���S���z<3�DH��]��]�r87��/��Y?���	�А�f��8 Gnk������.3=V-�pVa-��}�ܷ��b=������$�����EH��=P
���7)u�a�g�AF6�Z�{Wi��ۧ�� �s}������֍#@�/��|[��=2��'�:yB4�������引5B����(�e�`���Dd���(J��o����+gJ�.�wyK0.YT��Y�������z�m���zqS&rE��=_8����*rP=,{���h�!�����f�L����t+�U��#K�zf@�"a	�!�)ڗ�����k�Y2 �Z�Q?v�9s6| �F��ҙ�e���o��W [3G���wp�=fPx<�Aٺv�������o�#�=	�ui��1��J��#��׿��$�Dp�T��i����a�1�4ۋML�~j�(�MJu��FW�b=�ZX�׏�_N�;cC�`]�\lD0@�%�|����:n�*�i���Q��π:>m���'x�"B�m7TW���;j"�ב	��$�*��St�x�+��9"�X��
������z6w����r��B��Y���J��.�F؄���
�m���U��5�P�
�D�
��ܽ����x��1�_��6J����H��F��¯E F�5�.������v�J;Z�Q3�h����??>}�7��4k��e�P*�KC0w�aP�Dx���i8`� _}��V��aX$ZN�ivg�3v�� ��)�@4�Tw�@�:�vQ߄ȓ��n�$Vj�r�!x�z ��ZWfX�~����b�I���,�a��,��g{0���bv�G���S'�c�Fu���Oq�V��ǧ:>�QP��Bab�Ww%��(`yu����<���.��A�jo�:�IlM��<b�6��qsU��::O!��)�;&H񣞛.�A-Q��d8�s��`Iu
�YZ�%��Gi�����q1-���h��Ϡ+�q���*O��И(��Z;��4d> �zXr�tN6�5�-���QP!�7�v�r����xRJ�&�-�g�#�#Fy�]X�.󀴟��/}UD�d�s� ���DM�70����q��}23NW[F��j�c�`��7�P���8*���E�Hh
�lJU����}O�@��%��R�CY���a�؄�8w;� AH+�s�����K�M؆��>8���HY�,=������N*�#�B�4OBa�	�l�q��I
�`܎����
E$&ԓIt�yxϘF��+�#B�1Aa
+������#HR�� �p3:"2L��LṶ'-�ɤ����؞Uy_fU�چ꒩zԘJU8j��1��b)C4�bD|�b����D��c��3	K�i��܌��D�v ��0���E� �x9z���H�T�d��cW *QR~z>t�t4�u��0
.M"#�u ��]�vƾ�F1.(���mPMK�����;S�b��o���"!�h�E,drW^���j�n��+�[q�ҍ��H5KdխПX�4B�h�T�#tL���l G��>M����Eӫ(.���0,�*z��	��c7��_o��>b��� �1Uy۰q��W�Q��P\X���\��O].XZ�Y�� �xo8�1Kk�@l��v������8BB3��a��ّ'������ߺ]�¨�L0����=6�)�����uc���j�o5:K���:�L 1�'����"���0Դ&�ۚ12�����Ϝ0��1p�̄�	E�k�'0�n�]�4`#��!�c�s^� H�7!�� �����!�� PH��mg����Mq�����-ρ¶�X�&d�LI&4ON`;x=��@�o	x���0Z�B�
-1p�2xJ������UZi,/]�ᐰ4��(�Ue�&�L�o�a3�P]c�N}�x���,�����Kv����:f`�7��.Cؙ�����T��V�.��d�����ܹ4��y���}�h��ql�M��x- ��`$���hC�w�{p���6v����b�Y�ƃ��.D�e� �iԯ��*�*�(��z�V��E(�hV��g��S��i<i�Zզ�p`�wT6
�Md?9�Gd�1�0���8��C) ��=>��b�O�$Q�aE3���EV������+߲}�0F�r>'	��#L���k�,������E�o����%��*Q����3��� �`�p:�a,�ٔ&Ծ}#�r��Fpp��t��P8    �����#��WU/{X�o�_�OvaB3��m�ju_�*[B�DWY��_@��/��><��u݊����շn�q�J��z�+3c��j�O_��;&8���R⯺o�,��p�9�&�J������K|�ԭ�Ȩ�V���O�:����~&�s�.�����6F��cr���o�B-�>!"0�~y��,`���e@����vG�ەԄF���v���?�|QQ�W��U���f{*�~��t� �E�xa�"6��R��Ja	���sVE��md�k��&�=9�on�[�'uz�0!H�f)!=Q����T�����6
�\��]mUBq�r�^ނקz�J�4�VT[��P`�3:�.g�<]����D�ƃK�2)����D����g;퉊j���UN�(�|��ˎı�C`~W x�N�[9�º�{�ȉ%�h��t�n0L�b���0p���^0x$�\
���:��똃�%����
 g��J`JM`*�S=�9(��qy�1b(�*�����f�T���7pa�.�tR���a��(\��<��m�s��mŎ)U��	7"1�Jj�,|� �� %�I�;������ ������%~��o/���c��b�"i�Sw�
V]7^��,<�X�$y��xW;q�y���J_�iM1X������i!�@LK�C}���X�%���?����lU:��a~O��*Г��5�\/N] ]��x,Q�/Vm��~��[:�q��X�rp�Z��A��ku�=�T._�?��F��X��*x:>���5�s���Uq��l]��(�8}y�hA�y�\r3$��t$�$̰V�ɺ�CQ�L���"�ѕ�Ͷ��^�)jW�J�ӗ�F���nYsI��B���r�B;�`J����={���~{��a�4M�ҁ(��0��e&b�vv_��4}�ţLPʥ&K��!�X<��K�{�����฿���A��}'o��(4���ɤᒦ�:K��2�(�|�ʑDёW��5e�:���NV�봟.ȉC`m�����f��[8��D���Ҳ��iZ���i =m��b�S�P�2i:�g9��3�_���KrԺ�O�T9�x�(�*r/X��v���K7��/ň(�
��\��|��'5�w)�7�h(�\m�/N��yX���*�q7��J�9��H.��Pz4,����k�C�km/Ρ��{W�+2������?�>��2����/A.�\�$�н�ƭ0����_w�:��H�௸�r�ϵ��1f���1:���v	TxЉB�[]�\�
Kn|+ѭ�(��~��;�%�6�r�~�Æ���U4�����@n��V���X�~'�m��#~����X��-�[,E�
4�������ϫu(�Mi��4h0���6����o���Q?��R� �V'�	R=~K�4�n^�_wϏ�u3�e��bԚ�!��Hh_�NQ�nT7CkeX�桑�6b���κ�LYƔ�u�C�>b�4�����[��Z����#a�`&5���Yt���Ņ����%Ƹ^������hY#;� <6�b����>E��㧎�(�
W
7SH@�g>:��ZSQy�ߴ�kf�*ǣ�G��{6ֱ�0�j%H0&a�P&91~���Seq.���3���'B�&�;ɼq��ޑ$�����ld%L��|�@Ԅ<��~T��	����Z��?���v]������ �[p8.^
�Q���������G	,b��,�������� I��Vm��|�ѧc�U�0��}geݎ��Nsj���#R�l�}�'�_���nPp�q	3&��d�s��`�ɨ�a?�e���Q0ǲ��V-�xD���mz�XΎx��ilօ%QK��6o�J�Jp6�J��b�xXɗ�<�H��[L4 �D�)���V�$J��T��2Du�b�^3��TU�nG��H�Aqw?�Q�:l�ؕ-j����w�%�y���JI��@Ѥ�8ڵa(����Nh�a����i�\DA��-�� ��Ъ��P
�0�(x�$����k;JW��Rg΍m��K�^���e���l����x�����'�(�{l&ʁ�gϗ�m6_�������O��q�TU�P�V�x��o/.J�Q׳q�9C�(�Gcȼ�7�0aF��2�� l�<�b�.���Y�U�("��q�qb�w_0MOJ-r˘�`\"�����.틾����݇�x�x�o(�qX0	�и'MM��y*ϊk=Ş'a�8��vus�Q����M�^��BU�$nm"������+8Ӭ�ޥ����#�M1����{�"���P5njdS��f���0�W�)!�>�Q�R<���I��q�[i��$��Op��s�*�[���Ƣh������9�֋��4L�Z�h4
m.������>.E�\�1@��;x
0��?gw|��J���;�G(0����e����Q�g�L��o�$`��}E�ӵެc�ơ�L�C␱!�iEd��
���q�,�U���OkFj c]��Vf��^��������RL���:P��N�E!���ū����nt43�)g�cFiPj\k���%�����&��S���q"�8�EF���(o����q�k�p)�w/�����uнwO�toWwSsh��e*-%�I�������sʇ��\n�24��4=B���ƨ�Te��%�4��6B5���i�	o6�~3�����}��0�6�室���Ax�*���������?���մ���/�rv#��$��T�NS�B��+��:`���nP�a�������N
�3���X�粓B������J.kA�xr�X�$�6'ʔ��S3a}-^~����Ò�FI���k�P���@�G:�m�)�7;Bεb�tJ 8�J�����0�����?��?��2�)`HR�8d(ӾH_�>�3�Yw:��*F���8�bs���"}%������W����5w|WY���P�Ax�W����̭5Vơ�p�E}v"����B��c�,gƥ:�Z��DƟ�����˴��t����X�O�7^f��ק�0��楛�YN|�m8�C䱈{:�-G������ji�(,më�6c�8P+G*�ZQ)ab�a$Y�X��_���Ͳ�X���:=��>t����z8�3�*iU��V|�Pi��Y0ܷ�S���u�]V٥�&\�DV����>��v����,�1���:#i��@N ?�W��,_`��2�.$TB$�k��U���6ۙ�O�h"�+�ݢ|�'�o�@�&��DW����+�!ͣ6&��B�*J�t�]6$�&.�+�I�XKxK��9}u N	`c��������5Ø�sPz2�IQ��/ө�k���Rk��P�~FWY~��7��:�wl\�c$ME�_ޣ���׿�>�RV����-<
���M����vv����6�z����W���U����mV���?���4Kf�����Nd�@5����L`�����+{96l{Yl曶�&�fWE��&aA���u/����k�Σ���e c`�`��b.K,��:â-.ȫ���*�X�����7i���#ݬ��:�3ҡ��U6ߊ�{�V�Ъ�K��p��̗r�귭tt�ɹd����u�g0�'�Q��L		6#z��ps��h�;j �}wg����>�[(Hz(�-�50@��O9e��a�5��S6�nm]�a0B
C?�0U=��2
%��N
��c0������"�_�f�-��gs�'���� cC�k:su��\����!�UKO���a3f43(�VM?s���.��E�m�O���s�tp�����ܣZ�����x���/4���	����Y��%�F�-ʿ��d̷4��y��HҺ݃�0:F�D���{6Òa�I�_au�"2������Rˇ�dHH>�?�Z���>���'V��!9��N�9#5,�7,$��=��6����o����"chԈ�dvB�z����ȀpXg�oMXe�k����"\x�r��R��R
�t��dX�'�R��f=�#66�ra!��O��BpB�(,���M��}���µ"� �  ��g=��E�|߾`�ҳ�,O?a����L)X"(蔢|�.��p��Ƣ�%+˧����AA�C�`�ޔ�������e:���fb=EkS,���?]�������"��Q����z0a��p`��zv���j����6h@.t���ٮ��������]�O�i�\�y�K�"s{G�_(��H"4O�&�����j"V��avR8�*���u>��/��<[OI�,����~�	a6a��#���.�*̡��Њ�n�C~���H��~W�_`��nmu��;U��$V�D��L�(x�����ק�[_�6��,*Ҫ�A�/�l�ɯS覨��t��',��i\�v�iK"0���2��]��?9	�����V�B�1sH��~5[���s�{�:�cP��&�V�8�+	�R��Cr�u�e���1�	s��-/�6Q%���a��1o�m(��:��������i��PD�Ň��~~ٿ������G45��TS�9?0Y��`��|v@�{�:�.��S�ef�PP��8(��p�+��i�*C"6�Hy[��h�纫an��2��8ʔ�h�-^���C�&�*��*�J�W�Mz\ܑ��p�0V
vy�=��@���E�n�P,����u6�����~��*q�^
�0��^�~�F�g|�Q<ь��dN��C,+�{^e���?Ʃ�Z���vމ�I��	Q�_�_>�~}���׽߱�˗Oݓ76�"�Ҭ�����gr�Pz3�_>>ŇY��$��(�8����y� ku���G������}�x-��!����*s�2��9X�e@�N���"4a0��$,`�"�bDd�b�,먖��~����-�D�2M$m�)����~#l��ޱY\�[�F�Z����yڔ��0�25[{��~c�wm���2N�U2�l��ŗ� +�?a</6e
1�X�7̖�H?��qL���)���\�c��B�L1 ����=�aט 1}�$��Ͽ�;����i@%�T�s9�M��3�g\g:7�vW�+WS$���%Ь�V�=3=}K[2�i� �X]�3Q��*����`��	�ČZ�|8���1\�7Sm�E3���j��41�2�O;fA8q�Od���C����o��%v��_�;�UC�a���p0J|��<�=ܾ��r���X��y�uA���s���iĹ3M�.�<�E��G�3����y� ��T62���R�m�����)�O����}�������X9�OO�8}
6�V�R� �8@�#4G^���}�j�b
�)BH�?���Gf'�;��jC3��$ek��("�em@�Ⱥ�o����Ҹ��v� ��!+~Q�'K��c�_]�4�'��ᙰF���|��/�藻us��5��Z��ٴrP�Tj,�>��9c`T�hbC�d�����0ChvXV��勇J4.u��3��?7��Qn���*v�T�\�6넹H�j��;����ґ�q�a�l��2n�>�{�0u5�TO����Z�R"�������d`�џ��u��,ͫx����(Wtq�(eR=�/̙i>x( V�Ӻ8N��4_�����\�X���0�]ѓ
%畭�d6�$O��=[����h����b��S��[����}�>��9�{�5+����!��"T��m;���w��WRa��#���6ld���J�R��|���o�ń�,�O��X�3L�e�Z۾�W�w���ӥ�6���4��>`��/Gw�y��mNQ;��PSۗ�OD��B%IY��~2��PRۗ�L��>�4Z�~}���������������v�C��d���F(�:��xp\a�S>����c2�&uA�C�n�e�H��	_���|:�����0���)�2�Eбp��3E]�c
6��T%�ȄQ[�E�uR��Щ�,�^�*�"p��i|�N��L�Z�b$�R���	�V�K���	�\�F�5'�I�2G�<;�mw�4�D��d*B~��X�Z�e�]��O�`c��x:2жQx`�{�������%~������ ��~g@�VfC:�n3������5�`V��X�5�#�ze׋v�5��`Kb(oP>Y0d�@ZZ�QQ����wp���%IXe����g'�a���2ݚ�%a���_ժad�\�v��p�f9�a[���*l����%yo^�
�m�Jkt��D#P+�D��x���m�\l�oW�W�|�����(N ��mн���u����������T(5�M�nb���6y���^��7	�3�?� �,� ��Z��.��c�ti�������C�twbY~q��:������1����s~�QW�F|u]%wI�'�ϗW�,wr ��8�7PX)L���w���=��W��F��)��n�s�pp�)�y�N0n��M�m��c9w7p��4�0hޥ�k�O�N�sw�2{�^Wk"s�C���}��Ժ���3�D���.�¿́з���&��p�yh$�	l�y
�_�/� ����&+�n`j�|w�>��ǋ�t��`8�Mbl�)���`�`V ����4>���@7O��! G�ho��� �[)�"��+��	e"T���϶�#h��'g��z���q��ٺJ�K�H���i����sy�?<ve7	B*ܝ-"��Mƨ�S�`�6���K]�]H�hi�-����1b+������q������5��kʈ�/嫮TSL�h2Ú�:H��:ҡ�]�Jߋ;ۿ�*&���ea*Tc�59Q�)bS�~�u�x2����e&c�R=�6	�:wȨo�ס}V�q���,��q����,�$����s�F7L#_< p�vZJ`�ܕD�dO�s&iL�Y��զ�^��U
�\�=�����/�/ݚt�fP�V����Zg��7�������֎yS)��)a�mpw�p�t8^>�Z1~g^k#�&1�v�ʋ��D� <~�l�jpQ�VZ`�CP�?'�������1      7   �   x���;�0�g�\�(q ۪SU!u�P�"Q�x�g��Ja����-˿?��E!Sp�]a+�]�;���A��J����P�2�����tm>�L:s�+����&�m�W�pid���HM���!����~r_�^# ����Q�FI#��D,�.��!Fq�UbWvP�
�A4
i����(!�'�w/      5   �   x�e͹�0 ��}
VI�*�U�@��Ѹ��Hxz�Q��?�I�]ߚ� �����oA~�R��l=� Nk�=E!\�Ԕs��g��{n�q�iG�S��T
DX�.�:Xؘ���Y}	��Q]����_�\gm£x������	���U��=��+W<ߦ$K���?���6¦��P&�� �C@     